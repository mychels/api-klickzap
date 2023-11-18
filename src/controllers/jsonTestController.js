export default class JsonController {
  static async testJSON(req, res) {
    try {
      const data = req.body;
      console.log(JSON.stringify(data, null, 2));
      res.status(200).json({
        status: "ok",
      });
    } catch (e) {
      res.status(500).json({ message: `${e.message} - erro no servidor` });
    }
  }
}
