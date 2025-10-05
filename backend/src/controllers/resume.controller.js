const asyncHandler = require('express-async-handler');
const pdf = require('pdf-parse');
const { getPineconeClient } = require('../config/pinecone');
const { getEmbedding, getQueryAnswer } = require('../services/openai.service');
const Resume = require('../models/resume.model');
const { v4: uuidv4 } = require('uuid');

const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME;

// Helper function to chunk text
const chunkText = (text, chunkSize = 1000, overlap = 200) => {
    const chunks = [];
    for (let i = 0; i < text.length; i += chunkSize - overlap) {
        chunks.push(text.substring(i, i + chunkSize));
    }
    return chunks;
};

// @desc    Upload and process resumes
// @route   POST /api/resumes

exports.uploadResumes = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw { code: 'NO_FILES_UPLOADED', message: 'No files were uploaded.' };
  }

  const pinecone = getPineconeClient();
  const index = pinecone.index(PINECONE_INDEX_NAME);
  const processedFiles = [];

  for (const file of req.files) {
    const newResume = await Resume.create({
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      uploader: req.user.id,
    });

    try {
      // --- START OF CHANGES ---
      let data;
      try {
        data = await pdf(file.path);
      } catch (pdfError) {
        // This catch block specifically handles the "Invalid PDF structure" error
        console.error(`Skipping file ${file.originalname} due to invalid PDF structure:`, pdfError.message);
        newResume.status = 'failed';
        await newResume.save();
        processedFiles.push({ id: newResume.id, filename: newResume.originalName, status: 'failed', reason: 'Invalid PDF file.' });
        continue; // Skip to the next file in the loop
      }
      // --- END OF CHANGES ---

      const text = data.text;
      const chunks = chunkText(text);
      const vectors = [];

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const embedding = await getEmbedding(chunk);
        vectors.push({
          id: `${newResume.id}-chunk-${i}`,
          values: embedding,
          metadata: { resumeId: newResume.id.toString(), text: chunk },
        });
      }

      if (vectors.length > 0) {
        await index.upsert(vectors);
      }
      
      newResume.status = 'completed';
      await newResume.save();
      processedFiles.push({ id: newResume.id, filename: newResume.originalName, status: 'completed' });

    } catch (error) {
        console.error(`Failed to process file ${file.originalname} for other reasons:`, error);
        newResume.status = 'failed';
        await newResume.save();
        processedFiles.push({ id: newResume.id, filename: newResume.originalName, status: 'failed', reason: 'Processing error.' });
    }
  }

  res.status(201).json({ message: 'File processing complete.', files: processedFiles });
});

// @desc    Get resumes with pagination
// @route   GET /api/resumes
exports.getResumes = asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = parseInt(req.query.offset, 10) || 0;
    const query = req.query.q ? { originalName: { $regex: req.query.q, $options: 'i' } } : {};
    
    const resumes = await Resume.find({ uploader: req.user.id, ...query })
        .limit(limit)
        .skip(offset)
        .sort({ createdAt: -1 });

    res.status(200).json({
        items: resumes,
        next_offset: offset + resumes.length
    });
});

// @desc    Ask a question about the resumes
// @route   POST /api/ask
exports.askQuestion = asyncHandler(async (req, res) => {
    const { query, k = 3 } = req.body;
    if (!query) {
        res.status(400);
        throw new Error('Query is required');
    }

    const pinecone = getPineconeClient();
    const index = pinecone.index(PINECONE_INDEX_NAME);

    const queryEmbedding = await getEmbedding(query);

    const searchResults = await index.query({
        vector: queryEmbedding,
        topK: k,
        includeMetadata: true,
    });

    const context = searchResults.matches.map(match => match.metadata.text).join('\n---\n');
    
    const answer = await getQueryAnswer(context, query);

    res.status(200).json({
        answer,
        sources: searchResults.matches.map(match => ({
            resumeId: match.metadata.resumeId,
            textSnippet: match.metadata.text,
            score: match.score,
        })),
    });
});

// Other endpoints like getResumeById, postJob, matchJob can be added similarly