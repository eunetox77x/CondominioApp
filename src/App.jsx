import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [moradores, setMoradores] = useState([]);
  const [form, setForm] = useState({
    nome: "",
    telefone: "",
    cpf: "",
    email: "",
    confirmarEmail: "",
    senha: "",
    confirmarSenha: "",
  });

  const [erros, setErros] = useState({});

  // Máscara Telefone (limita a 11 dígitos antes de formatar)
  const formatTelefone = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    return digits
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
  };

  // Máscara CPF (corrigida: limita a 11 dígitos antes de formatar)
  const formatCPF = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    return digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "telefone") newValue = formatTelefone(value);
    if (name === "cpf") newValue = formatCPF(value);

    setForm({ ...form, [name]: newValue });
  };

  const validar = () => {
    let newErros = {};

    if (!form.nome) newErros.nome = "Nome é obrigatório";
    if ((form.telefone.replace(/\D/g, "")).length < 10)
      newErros.telefone = "Telefone inválido";
    if ((form.cpf.replace(/\D/g, "")).length !== 11)
      newErros.cpf = "CPF inválido";
    if (!/\S+@\S+\.\S+/.test(form.email)) newErros.email = "Email inválido";
    if (form.email !== form.confirmarEmail)
      newErros.confirmarEmail = "Emails não coincidem";
    if (form.senha.length < 6) newErros.senha = "Mínimo 6 caracteres";
    if (form.senha !== form.confirmarSenha)
      newErros.confirmarSenha = "Senhas não coincidem";

    setErros(newErros);
    return Object.keys(newErros).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validar()) return;

    setMoradores([...moradores, form]);
    setForm({
      nome: "",
      telefone: "",
      cpf: "",
      email: "",
      confirmarEmail: "",
      senha: "",
      confirmarSenha: "",
    });
    setErros({});
    alert("Morador cadastrado com sucesso!");
  };

  return (
    <div className="container-fluid vh-100 bg-light">
      <div className="row h-100">
        {/* Coluna esquerda */}
        <div className="col-md-6 d-flex flex-column justify-content-center align-items-center bg-primary text-white p-5">
          <h1 className="display-4 fw-bold mb-4">Condomínio Vida Feliz</h1>
          <p className="lead">
            Bem-vindo ao sistema de cadastramento de moradores.
            Facilite sua gestão com praticidade e segurança.
          </p>
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="Morador"
            width="200"
            className="mt-4"
          />
        </div>

        {/* Coluna direita */}
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <div className="card shadow-lg p-5 w-75">
            <h2 className="mb-4 text-center text-primary">Cadastro de Morador</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Nome</label>
                <input
                  type="text"
                  name="nome"
                  className={`form-control ${erros.nome && "is-invalid"}`}
                  value={form.nome}
                  onChange={handleChange}
                />
                <div className="invalid-feedback">{erros.nome}</div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Telefone</label>
                  <input
                    type="text"
                    name="telefone"
                    className={`form-control ${erros.telefone && "is-invalid"}`}
                    value={form.telefone}
                    onChange={handleChange}
                  />
                  <div className="invalid-feedback">{erros.telefone}</div>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">CPF</label>
                  <input
                    type="text"
                    name="cpf"
                    className={`form-control ${erros.cpf && "is-invalid"}`}
                    value={form.cpf}
                    onChange={handleChange}
                  />
                  <div className="invalid-feedback">{erros.cpf}</div>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className={`form-control ${erros.email && "is-invalid"}`}
                  value={form.email}
                  onChange={handleChange}
                />
                <div className="invalid-feedback">{erros.email}</div>
              </div>

              <div className="mb-3">
                <label className="form-label">Confirmar Email</label>
                <input
                  type="email"
                  name="confirmarEmail"
                  className={`form-control ${erros.confirmarEmail && "is-invalid"}`}
                  value={form.confirmarEmail}
                  onChange={handleChange}
                />
                <div className="invalid-feedback">{erros.confirmarEmail}</div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Senha</label>
                  <input
                    type="password"
                    name="senha"
                    className={`form-control ${erros.senha && "is-invalid"}`}
                    value={form.senha}
                    onChange={handleChange}
                  />
                  <div className="invalid-feedback">{erros.senha}</div>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Confirmar Senha</label>
                  <input
                    type="password"
                    name="confirmarSenha"
                    className={`form-control ${erros.confirmarSenha && "is-invalid"}`}
                    value={form.confirmarSenha}
                    onChange={handleChange}
                  />
                  <div className="invalid-feedback">{erros.confirmarSenha}</div>
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Cadastrar
              </button>
            </form>
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;
