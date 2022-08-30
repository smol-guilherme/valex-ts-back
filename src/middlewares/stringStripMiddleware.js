import { stripHtml } from "string-strip-html";

export default function clearData(req, res, next) {
  const data = [req.headers, req.params, req.query, req.body];
  const output = [...data];
  for(let i = 0; i < data.length; i++) {
    for (const param in data[i]) {
      if (typeof output[i][param] === "string") {
        output[i][param] = stripHtml(data[i][param]).result.trim();
      }
    }
  }
  res.status(200).send();
  next();
};