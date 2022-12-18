exports.successResponse = (data, res) => {
  res.status(200).json({ success: true, data: data });
};
