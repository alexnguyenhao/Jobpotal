import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const GOONG_API_KEY = process.env.GOONG_API_KEY;

export const getCoordinates = async (fullAddress) => {
  try {
    if (!fullAddress) return null;

    const url = `https://rsapi.goong.io/Geocode`;

    const response = await axios.get(url, {
      params: {
        address: fullAddress,
        api_key: GOONG_API_KEY,
      },
    });

    if (response.data.results && response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location;
      return {
        lat: location.lat,
        lng: location.lng,
      };
    } else {
      console.log("Goong không tìm thấy địa chỉ:", fullAddress);
      return null;
    }
  } catch (error) {
    console.error("Lỗi Goong Geocode:", error.message);
    return null;
  }
};
