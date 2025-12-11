let apostas = [];

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { nome, sexo, sugestao, tipoDoacao } = req.body;

    if (!nome || !sexo) {
      return res.status(400).json({ error: "Nome e sexo são obrigatórios." });
    }

    apostas.push({
      nome,
      sexo,
      sugestao: sugestao || "",
      tipoDoacao,
      data: new Date().toISOString(),
    });

    return res.status(200).json({ message: "Aposta registrada com sucesso!" });
  }

  if (req.method === 'GET') {
    return res.status(200).json(apostas);
  }

  return res.status(405).json({ error: "Método não permitido." });
}
