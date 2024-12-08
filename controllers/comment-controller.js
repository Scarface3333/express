const {prisma} = require('../prisma/prisma-client')

const CommentController = {
  createComment: async (req, res) => {
      try {
          let { postId, content } = req.body;
          const userId = parseInt(req.user.userId, 10);
          postId = parseInt(postId, 10);

          // Проверка на корректность ID
          if (isNaN(userId) || isNaN(postId)) {
              return res.status(400).json({ error: 'Invalid ID format' });
          }

          if (!postId || !content) {
              return res.status(400).json({ error: 'Все поля обязательны' });
          }

          const comment = await prisma.comment.create({
              data: {
                  postId,
                  userId,
                  content
              },
          });

          res.json(comment);
      } catch (error) {
          console.error('Error creating comment:', error);
          res.status(500).json({ error: 'Не удалось создать комментарий' });
      }
  },
  
  deleteComment: async (req, res) => {
      let { id } = req.params;
      const userId = parseInt(req.user.userId, 10);
      id = parseInt(id, 10);

      // Проверка на корректность ID
      if (isNaN(userId) || isNaN(id)) {
          return res.status(400).json({ error: 'Invalid ID format' });
      }

      try {
          const comment = await prisma.comment.findUnique({ where: { id } });

          if (!comment) {
              return res.status(404).json({ error: 'Комментарий не найден' });
          }

          if (comment.userId !== userId) {
              return res.status(403).json({ error: 'Нет доступа' });
          }

          await prisma.comment.delete({ where: { id } });

          res.json(comment);
      } catch (error) {
          console.error('Error deleting comment', error);
          res.status(500).json({ error: 'Internal server error' });
      }
  }
}


module.exports = CommentController;