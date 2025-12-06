import { useState, useEffect } from "react";
import axios from "axios";

export default function useLocationVN() {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  // --- Fetch Provice on render ---
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await axios.get(
          "https://provinces.open-api.vn/api/?depth=1"
        );
        setProvinces(res.data);
      } catch (error) {
        console.error("Failed to fetch provinces", error);
      }
    };
    fetchProvinces();
  }, []);

  // --- Load Districts When Province Change ---
  const loadDistricts = async (provinceName) => {
    setDistricts([]);
    setWards([]);

    const selectedProvince = provinces.find((p) => p.name === provinceName);
    if (selectedProvince) {
      try {
        const res = await axios.get(
          `https://provinces.open-api.vn/api/p/${selectedProvince.code}?depth=2`
        );
        setDistricts(res.data.districts);
      } catch (error) {
        console.error("Failed to fetch districts");
      }
    }
  };

  // --- Load Wards When District Change ---
  const loadWards = async (districtName) => {
    setWards([]);

    const selectedDistrict = districts.find((d) => d.name === districtName);
    if (selectedDistrict) {
      try {
        const res = await axios.get(
          `https://provinces.open-api.vn/api/d/${selectedDistrict.code}?depth=2`
        );
        setWards(res.data.wards);
      } catch (error) {
        console.error("Failed to fetch wards");
      }
    }
  };

  return {
    provinces,
    districts,
    wards,
    loadDistricts,
    loadWards,
    setDistricts,
    setWards,
  };
}
