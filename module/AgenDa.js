const { Schema, model } = require("mongoose");

const AgenDaSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      required: true,
    },
    complete: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// export the model
const AgenDa = model("AgenDa", AgenDaSchema);
module.exports = AgenDa;
