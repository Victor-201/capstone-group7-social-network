import { DataTypes } from "sequelize";

const ProfileVisible = (sequelize) => {
  const model = sequelize.define(
    'ProfileVisible',
    {
      profile_detail_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      field_name: {
        type: DataTypes.ENUM(
          'job',
          'education',
          'relationship_status',
          'hometown',
          'location',
          'created_at',
        ),
        allowNull: false,
        primaryKey: true,
      },
      is_visible: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: 'profile_visible',
      timestamps: false,
    }
  );

  model.associate = (models) => {
    model.belongsTo(models.ProfileDetail, {
      foreignKey: 'profile_detail_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };
  
  return model;
};

export default ProfileVisible;
