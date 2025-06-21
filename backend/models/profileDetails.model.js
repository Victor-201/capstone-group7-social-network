import { DataTypes } from "sequelize";

const ProfileDetail = (sequelize) => {
    const model = sequelize.define('ProfileDetail', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        job: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        education: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        location: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        bio: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        gender: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        birth_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        hometown: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        relationship_status: {
            type: DataTypes.ENUM(
                'single',
                'in_a_relationship',
                'engaged',
                'married'
            ),
            allowNull: false,
            defaultValue: 'single',
        },
    },
        {
            tableName: 'profile_details',
            timestamps: false,
        }
    );

    model.associate = (models) => {
        model.belongsTo(models.UserInfo, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
        model.hasMany(models.ProfileVisible, {
            foreignKey: 'profile_detail_id',
            as: 'visibleFields',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
    };

    return model;
};

export default ProfileDetail;
