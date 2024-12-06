const express = require('express');
const auth = require('../middleware/auth');
const multer = require('multer');
const router = express.Router();

const booksCtrl = require('../controllers/Ctrl-Books');


router.get('/', auth, booksCtrl.getAllBook);
router.post('/', auth, multer, booksCtrl.createBook);
router.get('/:id', auth, booksCtrl.getOneBook);
router.put('/:id', auth, multer, booksCtrl.modifyBook);
router.delete('/:id', auth, booksCtrl.deleteBook);

module.exports = router;