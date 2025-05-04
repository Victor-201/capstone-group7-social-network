const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const PostMedia = sequelize.define('PostMedia',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            post_id: {
                type: DataTypes.UUID,
                references: {
                    model: 'posts',
                    key: 'id'
                }
            },
            media_url: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            media_type: {
                type: DataTypes.STRING,
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            }
        },
        {
            tableName: 'post_media',
            timestamps: false,
        }
    )
    PostMedia.associate = (models) => {
        PostMedia.belongsTo(models.Post, { foreignKey: 'post_id' });
    };
}