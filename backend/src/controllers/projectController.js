const Project = require('../models/Project');
const Page = require('../models/Page');

// CREATE PROJECT
exports.createProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const project = await Project.create({
      name,
      description,
      userId: req.user._id,
    });

    res.status(201).json({
      status: 'success',
      data: { project },
    });
  } catch (err) {
    next(err);
  }
};

// LIST PROJECTS
exports.listProjects = async (req, res, next) => {
  try {
    // Basic pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const projects = await Project.find({ userId: req.user._id })
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await Project.countDocuments({ userId: req.user._id });

    res.status(200).json({
      status: 'success',
      results: projects.length,
      total,
      page,
      data: { projects },
    });
  } catch (err) {
    next(err);
  }
};

// GET PROJECT
exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!project) {
      return res.status(404).json({ status: 'fail', message: 'Project not found' });
    }

    res.status(200).json({
      status: 'success',
      data: { project },
    });
  } catch (err) {
    next(err);
  }
};

// UPDATE PROJECT
exports.updateProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { name, description, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ status: 'fail', message: 'Project not found' });
    }

    res.status(200).json({
      status: 'success',
      data: { project },
    });
  } catch (err) {
    next(err);
  }
};

// DELETE PROJECT (Soft Delete)
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isDeleted: true },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ status: 'fail', message: 'Project not found' });
    }

    // Optionally soft delete ALL pages in this project
    await Page.updateMany({ projectId: project._id }, { isDeleted: true });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    next(err);
  }
};
