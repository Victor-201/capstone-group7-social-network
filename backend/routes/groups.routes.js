// Groups Routes
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth.middleware');
const { initModels } = require('../config/database');
const { Op } = require('sequelize');

// Initialize models
const models = initModels();
const Group = models.Group;
const User = models.User;
const Post = models.Post;

// Get all groups (with search and filter)
router.get('/', async (req, res) => {
  try {
    const { search, privacy, limit = 20, page = 1 } = req.query;
    const offset = (page - 1) * limit;
    
    // Build where clause based on filters
    const whereClause = {};
    
    if (search) {
      whereClause.name = { [Op.like]: `%${search}%` };
    }
    
    if (privacy && ['public', 'private'].includes(privacy)) {
      whereClause.privacy = privacy;
    }
    
    const groups = await Group.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username', 'fullName', 'avatar']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });
    
    // Get member count for each group
    for (let group of groups.rows) {
      const memberCount = await group.countMembers();
      group.dataValues.memberCount = memberCount;
    }
    
    res.json({
      totalCount: groups.count,
      totalPages: Math.ceil(groups.count / limit),
      currentPage: parseInt(page),
      groups: groups.rows
    });
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get my groups (groups user is member of)
router.get('/my-groups', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const groups = await user.getGroups({
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username', 'fullName', 'avatar']
        }
      ]
    });
    
    // Get member count for each group
    for (let group of groups) {
      const memberCount = await group.countMembers();
      group.dataValues.memberCount = memberCount;
      
      // Check if user is admin (creator)
      group.dataValues.isAdmin = group.creatorId === userId;
      
      // Get unread posts count (would require tracking of last read)
      group.dataValues.unreadPosts = 0; // Placeholder for now
    }
    
    res.json(groups);
  } catch (error) {
    console.error("Error fetching user groups:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get recommended groups
router.get('/recommended', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get groups user is not a member of, ordered by member count
    const userGroups = await User.findByPk(userId, {
      include: [{
        model: Group,
        as: 'groups',
        attributes: ['id']
      }]
    });
    
    const userGroupIds = userGroups.groups.map(g => g.id);
    
    const recommendedGroups = await Group.findAll({
      where: {
        id: { [Op.notIn]: userGroupIds.length > 0 ? userGroupIds : [0] },
        privacy: 'public'
      },
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username', 'fullName', 'avatar']
        }
      ],
      limit: 10
    });
    
    // Get member count for each group
    for (let group of recommendedGroups) {
      const memberCount = await group.countMembers();
      group.dataValues.memberCount = memberCount;
    }
    
    // Sort by member count (most popular first)
    recommendedGroups.sort((a, b) => b.dataValues.memberCount - a.dataValues.memberCount);
    
    res.json(recommendedGroups);
  } catch (error) {
    console.error("Error fetching recommended groups:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get single group
router.get('/:id', async (req, res) => {
  try {
    const groupId = req.params.id;
    
    const group = await Group.findByPk(groupId, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username', 'fullName', 'avatar']
        }
      ]
    });
    
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    
    // Get member count
    const memberCount = await group.countMembers();
    group.dataValues.memberCount = memberCount;
    
    // Check if user is a member (if authenticated)
    if (req.headers.authorization) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const authMiddleware = require('../middleware/auth.middleware');
        const decoded = authMiddleware.decodeToken(token);
        
        if (decoded?.id) {
          const isMember = await group.hasMember(decoded.id);
          group.dataValues.isMember = isMember;
          
          // Check if user is admin (creator)
          group.dataValues.isAdmin = group.creatorId === decoded.id;
        }
      } catch (err) {
        console.error("Auth check error:", err);
      }
    }
    
    res.json(group);
  } catch (error) {
    console.error("Error fetching group:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create a group
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, description, privacy, image, coverImage } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: "Group name is required" });
    }
    
    const newGroup = await Group.create({
      name,
      description,
      privacy: privacy || 'public',
      image,
      coverImage,
      creatorId: req.user.id
    });
    
    // Add creator as member
    await newGroup.addMember(req.user.id);
    
    res.status(201).json(newGroup);
  } catch (error) {
    console.error("Error creating group:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Join a group
router.post('/:id/join', verifyToken, async (req, res) => {
  try {
    const groupId = req.params.id;
    const userId = req.user.id;
    
    const group = await Group.findByPk(groupId);
    
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    
    // Check if already a member
    const isMember = await group.hasMember(userId);
    
    if (isMember) {
      return res.status(400).json({ message: "Already a member of this group" });
    }
    
    // Join the group
    await group.addMember(userId);
    
    // Get updated member count
    const memberCount = await group.countMembers();
    
    res.json({
      success: true,
      message: "Successfully joined the group",
      memberCount
    });
  } catch (error) {
    console.error("Error joining group:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Leave a group
router.post('/:id/leave', verifyToken, async (req, res) => {
  try {
    const groupId = req.params.id;
    const userId = req.user.id;
    
    const group = await Group.findByPk(groupId);
    
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    
    // Check if a member
    const isMember = await group.hasMember(userId);
    
    if (!isMember) {
      return res.status(400).json({ message: "Not a member of this group" });
    }
    
    // Check if user is the creator
    if (group.creatorId === userId) {
      return res.status(400).json({ message: "Group creator cannot leave the group. Transfer ownership or delete the group instead." });
    }
    
    // Leave the group
    await group.removeMember(userId);
    
    // Get updated member count
    const memberCount = await group.countMembers();
    
    res.json({
      success: true,
      message: "Successfully left the group",
      memberCount
    });
  } catch (error) {
    console.error("Error leaving group:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get group posts
router.get('/:id/posts', async (req, res) => {
  try {
    const groupId = req.params.id;
    
    const group = await Group.findByPk(groupId);
    
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    
    // Check if user can view posts (public group or user is member)
    let canView = group.privacy === 'public';
    
    if (!canView && req.headers.authorization) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const authMiddleware = require('../middleware/auth.middleware');
        const decoded = authMiddleware.decodeToken(token);
        
        if (decoded?.id) {
          const isMember = await group.hasMember(decoded.id);
          canView = isMember;
        }
      } catch (err) {
        console.error("Auth check error:", err);
      }
    }
    
    if (!canView) {
      return res.status(403).json({ message: "You must be a member to view posts in this private group" });
    }
    
    // Get group posts
    const posts = await Post.findAll({
      where: { groupId: groupId },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'fullName', 'avatar']
        }
      ],
      order: [['created_at', 'DESC']]
    });
    
    res.json(posts);
  } catch (error) {
    console.error("Error fetching group posts:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;