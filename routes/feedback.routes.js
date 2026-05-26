const router = require('express').Router({ mergeParams: true });
const { getFeedback, submitFeedback, updateStatus, replyFeedback, upvoteFeedback } = require('../controllers/feedback.controller');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.get('/', auth, getFeedback);
router.post('/', auth, submitFeedback);
router.patch('/:feedbackId/status', auth, role('admin'), updateStatus);
router.post('/:feedbackId/reply', auth, role('admin'), replyFeedback);
router.post('/:feedbackId/upvote', auth, upvoteFeedback);

module.exports = router;