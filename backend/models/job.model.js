import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    requirements: [String],
    benefits: [String],
    location: {
      province: {
        type: String,
        enum: [
          "An Giang",
          "Bà Rịa - Vũng Tàu",
          "Bắc Giang",
          "Bắc Kạn",
          "Bạc Liêu",
          "Bắc Ninh",
          "Bến Tre",
          "Bình Dương",
          "Bình Định",
          "Bình Phước",
          "Bình Thuận",
          "Cà Mau",
          "Cần Thơ",
          "Cao Bằng",
          "Đà Nẵng",
          "Đắk Lắk",
          "Đắk Nông",
          "Điện Biên",
          "Đồng Nai",
          "Đồng Tháp",
          "Gia Lai",
          "Hà Giang",
          "Hà Nam",
          "Hà Nội",
          "Hà Tĩnh",
          "Hải Dương",
          "Hải Phòng",
          "Hậu Giang",
          "Hòa Bình",
          "Hưng Yên",
          "Khánh Hòa",
          "Kiên Giang",
          "Kon Tum",
          "Lai Châu",
          "Lâm Đồng",
          "Lạng Sơn",
          "Lào Cai",
          "Long An",
          "Nam Định",
          "Nghệ An",
          "Ninh Bình",
          "Ninh Thuận",
          "Phú Thọ",
          "Phú Yên",
          "Quảng Bình",
          "Quảng Nam",
          "Quảng Ngãi",
          "Quảng Ninh",
          "Quảng Trị",
          "Sóc Trăng",
          "Sơn La",
          "Tây Ninh",
          "Thái Bình",
          "Thái Nguyên",
          "Thanh Hóa",
          "Thừa Thiên Huế",
          "Tiền Giang",
          "TP. Hồ Chí Minh",
          "Trà Vinh",
          "Tuyên Quang",
          "Vĩnh Long",
          "Vĩnh Phúc",
          "Yên Bái",
        ],
        required: true,
      },
      district: {
        type: String,
        default: "",
      },
      address: {
        type: String,
        default: "",
      },
    },
    salary: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
      currency: {
        type: String,
        enum: ["VND", "USD"],
        default: "VND",
      },
      isNegotiable: {
        type: Boolean,
        default: false,
      },
    },

    experienceLevel: {
      type: String,
      required: true,
    },

    seniorityLevel: {
      type: String,
      enum: [
        "Intern",
        "Junior",
        "Mid",
        "Senior",
        "Lead",
        "Manager",
        "Director",
        "Executive",
      ],
      required: true,
    },

    jobType: {
      type: [String],
      enum: ["Full-time", "Part-time", "Remote", "Contract", "Internship"],
      required: true,
    },

    numberOfPositions: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      enum: ["Open", "Closed"],
      default: "Open",
    },

    applicationDeadline: {
      type: Date,
      required: true,
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobCategory",
      required: true,
    },

    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    applications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
      },
    ],
  },
  { timestamps: true }
);

export const Job = mongoose.model("Job", JobSchema);
