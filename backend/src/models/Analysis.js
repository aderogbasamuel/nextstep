import mongoose from "mongoose"

const AnalysisSchema= new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true,
    },
    type: {
        type: "",
        enum: ["internship", "scholarship", "grant", "Fellowship", "job", "university"],
        required: true,
    },
    match: {
        type: number,
        default: 0,
        required: true,
    },
    status: {
        type: String,
        enum: ["eligible", "Needs Review"],
        default: "pending",
        required: true,
    },
    // date:{},
    tone: {
        type: String,
        enum: ["green", "amber"],
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
},{
    timestamps: true
})

module.exports=mongoose.model("Analysis",AnalysisSchema)