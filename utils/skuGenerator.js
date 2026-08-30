const generateSKU = (category, itemName) => {
  const catCode = category.substring(0, 3).toUpperCase();
  const nameCode = itemName.replace(/\s+/g, '').substring(0, 4).toUpperCase();
  const uniqueNum = Math.floor(1000 + Math.random() * 9000);
  return `${catCode}-${nameCode}-${uniqueNum}`;
};

module.exports = generateSKU;