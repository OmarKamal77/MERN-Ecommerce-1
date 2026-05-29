import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        // 🌟 ضفنا الحقول دي جوه السكيمة عشان المونجوز يوافق يحفظهم ويعرضهم
        phone: { type: String, default: "Not Provided" },
        address: { type: String, default: "Not Provided" },
        cartData: { type: Object, default: {} },
    },
    { minimize: false }
);

// 🌟 التصليح السحري: ضفنا حرف الـ S اللّي كان موقف حال السيرفر ومنعنا الـ Overwrite Crash
const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;