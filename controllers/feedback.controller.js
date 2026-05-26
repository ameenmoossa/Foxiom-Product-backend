const Feedback = require('../models/Feedback');
const Notification = require('../models/Notification');

exports.getFeedback = async (req, res) => {
  const feedback = await Feedback.find({ product_id: req.params.id }).populate('submitted_by', 'name');
  res.json(feedback);
};

exports.submitFeedback = async (req, res) => {
  try {
    const fb = await Feedback.create({ ...req.body, product_id: req.params.id, submitted_by: req.user.id });
    res.status(201).json(fb);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const fb = await Feedback.findByIdAndUpdate(
      req.params.feedbackId,
      { status: req.body.status },
      { new: true }
    );
    await Notification.create({
      user_id: fb.submitted_by,
      message: `Your feedback "${fb.title}" status changed to ${req.body.status}`,
      feedback_id: fb._id,
      product_id: fb.product_id,
    });
    res.json(fb);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.replyFeedback = async (req, res) => {
  try {
    const fb = await Feedback.findByIdAndUpdate(req.params.feedbackId, { admin_reply: req.body.reply }, { new: true });
    res.json(fb);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.upvoteFeedback = async (req, res) => {
  try {
    const fb = await Feedback.findById(req.params.feedbackId);
    if (fb.upvoted_by.includes(req.user.id))
      return res.status(400).json({ message: 'Already upvoted' });
    fb.upvoted_by.push(req.user.id);
    fb.upvote_count += 1;
    await fb.save();
    res.json(fb);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};