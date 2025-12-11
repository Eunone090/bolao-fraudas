import apostas from "./aposta";

export default function handler(req, res) {
  const total = apostas.length;

  const menino = apostas.filter(a => a.sexo === "c").length;
  const menina = apostas.filter(a => a.sexo === "d").length;

  res.status(200).json({
    total,
    menino,
    menina,
    porcentagemMenino: total ? (menino / total) * 100 : 0,
    porcentagemMenina: total ? (menina / total) * 100 : 0,
    apostas,
  });
}
