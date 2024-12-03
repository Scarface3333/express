const {prisma} = require('../prisma/prisma-client')

const FollowController = {
    followUser: async (req,res) => {
        const {followingId} = req.body;
        const userId = req.user.userId;

        if(followingId === userId){
            return res.status(500).json({error:'Вы не можете подписаться на самого себя'})
        }

        try {
            const existingSubscription = await prisma.follows.findFirst({
                where: {
                    AND: [
                        {followerId:userId},
                        {followingId}
                    ]
                }
            })

            if(existingSubscription){
                return res.status(400).json({error:'Подписка уже существует'})
            }

            await prisma.follows.create({
                data:{
                    follower:{connect:{id: userId}},
                    following:{connect:{id: followingId}},
                }
            })

            res.status(201).json({message:'Подписка уже создана'})
        } catch (error) {
            console.error('Follow error',error);
            return res.status(500).json({error:'Internal server error'})
        }
    },
    // unfollowUser: async (req,res) => {
    //    const {followingId} = req.body;
    //    const userId = req.user.userId;

    //    try {
    //     const follows = await prisma.follows.findFirst({
    //         where:{
    //             AND: [
    //                 {followerId:userId},
    //                 {followingId:followingId}
    //             ]
    //         }
    //     })

    //     if(!follows){
    //         return res.status(404).json({error:'Вы не подписаны на этого пользователя'})
    //     }

    //     await prisma.follows.delete({
    //         where:{id:follows.id}
    //     })

    //     res.status(200).json({message:'Вы отписались'})
    //    } catch (error) {
    //     console.error('Unfollow error',error);
    //     return res.status(500).json({error:'Internal server error'})
    //    }
    // }

    unfollowUser: async (req, res) => {
        const { followingId } = req.body;
        const userId = req.user.userId;
    
        try {
          const follows = await prisma.follows.findFirst({
            where: {
              AND: [{ followerId: userId }, { followingId: followingId }]
            },
          });
    
          if (!follows) {
            return res.status(404).json({ error: "Запись не найдена" });
          }
    
          await prisma.follows.delete({
            where: { id: follows.id },
          });
    
          res.status(200).json({ message: 'Отписка успешно выполнена' });
        } catch (error) {
          console.log('error', error)
          res.status(500).json({ error: 'Ошибка сервера' });
        }
      }
}

module.exports = FollowController