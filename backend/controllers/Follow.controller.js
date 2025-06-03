import models from '../models/index.js';

const { Follow } = models;
export const FollowUser = async (req, res) => {
    const following_id = req.params.id;
    const follower_id = req.user.id;
    try {
        const follow = await Follow.create({
            follower_id,
            following_id
        });
        res.status(201).json({ message: 'Followed successfully', follow });
    } catch (error) {
        console.error('Error following user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const UnfollowUser = async (req, res) => {
    const following_id = req.params.id;
    const follower_id = req.user.id;
    try {
        const follow = await Follow.destroy({
            where: {
                follower_id,
                following_id
            }
        });
        if (follow) {
            res.status(200).json({ message: 'Unfollowed successfully' });
        } else {
            res.status(404).json({ message: 'Follow relationship not found' });
        }
    } catch (error) {
        console.error('Error unfollowing user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}