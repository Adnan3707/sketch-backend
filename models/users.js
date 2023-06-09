"use strict";
const { Model } = require("sequelize");
const crypto = require("crypto");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
     validatePassword(salt, password, old_hash) {
      // email is supplied as Salt to create unique hash
      var hash = crypto
        .pbkdf2Sync(password, salt, 1000, 64, "sha512")
        .toString("hex");
      return old_hash === hash; // Compare and return true or false based on the user data
    };
    generatePasswordReset = function() {
      this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
      this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
  };
  }
  User.init(
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      Gender: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      City: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("CLIENT", "DESIGNER", "ADMIN"),
        defaultValue: "CLIENT",
        allowNull: false,
      },
      country_code: {
        type: DataTypes.STRING(5),
        allowNull: false,
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      resetPasswordToken: {
        type: DataTypes.STRING,
        required: false
    },
    resetPasswordExpires: {
        type: DataTypes.STRING,
        required: false
    },
      last_activity: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      user_status: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true,
      },
    },
    {
      sequelize,
      tableName: "users",
    }
  );

  User.setPassword = function (salt, password) {
    // email is supplied as Salt to create unique hash
    let hash = crypto
      .pbkdf2Sync(password, salt, 1000, 64, "sha512")
      .toString("hex");
    return hash;
  };



  return User;
};
