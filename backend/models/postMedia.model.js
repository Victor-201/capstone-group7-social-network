import { DataTypes } from 'sequelize';

const PostMedia = (sequelize) => {
    const model = sequelize.define('PostMedia',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            post_id: {
                type: DataTypes.UUID,
                allowNull: false,
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
    model.associate = (models) => {
        model.belongsTo(models.Post, {
            foreignKey: 'post_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
    };

    return model;
}

export default PostMedia;