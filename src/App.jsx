import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [moradores, setMoradores] = useState([]);
  const [submitClicked, setSubmitClicked] = useState(false);
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
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [infoIndex, setInfoIndex] = useState(null);
  const [modalMessage, setModalMessage] = useState("");
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const formatTelefone = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    return digits
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
  };

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

    if (submitClicked) validarForm({ ...form, [name]: newValue });
  };

  const validarForm = (currentForm) => {
    const newErros = {};
    if (currentForm.nome.length < 4) newErros.nome = "Mínimo 4 Caracteres";
    if (currentForm.telefone.replace(/\D/g, "").length < 10)
      newErros.telefone = "Mínimo 12 caracteres";
    if (currentForm.cpf.replace(/\D/g, "").length !== 11)
      newErros.cpf = "Mínimo 11 caracteres";
    if (!/\S+@\S+\.\S+/.test(currentForm.email))
      newErros.email = "Email inválido";
    if (!currentForm.confirmarEmail)
      newErros.confirmarEmail = "Confirme seu email";
    if (currentForm.email !== currentForm.confirmarEmail)
      newErros.confirmarEmail = "Emails não coincidem";
    if (currentForm.senha.length < 6)
      newErros.senha = "Mínimo 6 caracteres";
    if (!currentForm.confirmarSenha)
      newErros.confirmarSenha = "Confirme sua senha";
    if (
      currentForm.senha &&
      currentForm.confirmarSenha &&
      currentForm.senha !== currentForm.confirmarSenha
    )
      newErros.confirmarSenha = "Senhas não coincidem";

    setErros(newErros);
    return newErros;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitClicked(true);

    const validationErrors = validarForm(form);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    setTimeout(() => {
      if (editingIndex !== null) {
        const updated = [...moradores];
        updated[editingIndex] = form;
        setMoradores(updated);
        setEditingIndex(null);
        setModalMessage("Morador atualizado com sucesso!");
      } else {
        // Novo cadastro
        setMoradores([...moradores, form]);
        setModalMessage("Morador cadastrado com sucesso!");
      }

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
      setLoading(false);
      setSubmitClicked(false);
      setShowModal(true);
    }, 1000);
  };

  const handleDeleteClick = (index) => {
    setDeleteIndex(index);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deleteIndex !== null) {
      const updated = moradores.filter((_, i) => i !== deleteIndex);
      setMoradores(updated);

      // 🔹 Corrige bug da tela branca
      if (infoIndex === deleteIndex) {
        setInfoIndex(null);
      } else if (infoIndex > deleteIndex) {
        setInfoIndex(infoIndex - 1);
      }
    }
    setDeleteIndex(null);
    setShowDeleteModal(false);
  };

  const handleEdit = (index) => {
    setForm(moradores[index]);
    setEditingIndex(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleInfo = (index) => {
    setInfoIndex(index === infoIndex ? null : index);
  };

  return (
    <div className="container-fluid bg-light min-vh-100">
      <div className="row">
        {/* Coluna esquerda */}
        <div className="col-md-6 d-flex flex-column justify-content-center align-items-center bg-primary text-white p-5">
          <h1 className="display-4 fw-bold mb-4">Condomínio Vida Feliz</h1>
          <p className="lead">
            Bem-vindo ao sistema de cadastramento de moradores. Facilite sua
            gestão com praticidade e segurança.
          </p>
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="Morador"
            width="200"
            className="mt-4"
          />
        </div>

        {/* Coluna direita */}
        <div className="col-md-6 d-flex flex-column align-items-center justify-content-center p-5">
          {/* Formulário */}
          <div className="card shadow-lg p-5 w-100">
            <h2 className="mb-4 text-center text-primary">
              {editingIndex !== null ? "Atualizar Morador" : "Cadastro de Morador"}
            </h2>
            <form onSubmit={handleSubmit}>
              {/* Nome */}
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

              {/* Telefone e CPF */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Telefone</label>
                  <input
                    type="text"
                    name="telefone"
                    autoComplete="new-tel"
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

              {/* Email */}
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  autoComplete="new-email"
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
                  autoComplete="new-confirm-email"
                  className={`form-control ${erros.confirmarEmail && "is-invalid"}`}
                  value={form.confirmarEmail}
                  onChange={handleChange}
                />
                <div className="invalid-feedback">{erros.confirmarEmail}</div>
              </div>

              {/* Senha */}
              <div className="col-12 mb-3 position-relative">
                <label className="form-label">Senha</label>
                <input
                  type={showSenha ? "text" : "password"}
                  name="senha"
                  autoComplete="new-password"
                  className={`form-control pe-5 ${erros.senha && "is-invalid"}`}
                  value={form.senha}
                  onChange={handleChange}
                />
                {!erros.senha && (
                  <span
                    onClick={() => setShowSenha(!showSenha)}
                    style={{
                      position: "absolute",
                      right: "15px",
                      top: "70%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                    }}
                  >
                    {showSenha ? "👁️" : "🔒"}
                  </span>
                )}
                <div className="invalid-feedback">{erros.senha}</div>
              </div>

              {/* Confirmar Senha */}
              <div className="col-12 mb-3 position-relative">
                <label className="form-label">Confirmar Senha</label>
                <input
                  type={showConfirmarSenha ? "text" : "password"}
                  name="confirmarSenha"
                  autoComplete="new-password"
                  className={`form-control pe-5 ${erros.confirmarSenha && "is-invalid"}`}
                  value={form.confirmarSenha}
                  onChange={handleChange}
                />
                {!erros.confirmarSenha && (
                  <span
                    onClick={() => setShowConfirmarSenha(!showConfirmarSenha)}
                    style={{
                      position: "absolute",
                      right: "15px",
                      top: "70%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                    }}
                  >
                    {showConfirmarSenha ? "👁️" : "🔒"}
                  </span>
                )}
                <div className="invalid-feedback">{erros.confirmarSenha}</div>
              </div>

              {/* Botão */}
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm"></span>
                ) : editingIndex !== null ? (
                  "Atualizar"
                ) : (
                  "Cadastrar"
                )}
              </button>
            </form>
          </div>

          {/* Lista de moradores */}
          <div className="card shadow-lg p-4 w-100 mt-5">
            <h3 className="mb-4 text-center text-primary">
              Moradores Cadastrados
            </h3>
            {moradores.length === 0 ? (
              <p className="text-center">Nenhum morador cadastrado.</p>
            ) : (
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Telefone</th>
                    <th>CPF</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {moradores.map((morador, index) => (
                    <tr key={index}>
                      <td>{morador.nome}</td>
                      <td>{morador.telefone}</td>
                      <td>{morador.cpf}</td>
                      <td>
                        <button
                          className="btn btn-info btn-sm me-2"
                          onClick={() => handleInfo(index)}
                        >
                          Info
                        </button>
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => handleEdit(index)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteClick(index)}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Informações detalhadas */}
            {infoIndex !== null && moradores[infoIndex] && (
              <div className="alert alert-secondary mt-3">
                <h5>Informações de {moradores[infoIndex].nome}:</h5>
                <p>
                  <strong>Telefone:</strong> {moradores[infoIndex].telefone}
                </p>
                <p>
                  <strong>CPF:</strong> {moradores[infoIndex].cpf}
                </p>
                <p>
                  <strong>Email:</strong> {moradores[infoIndex].email}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Sucesso */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">Sucesso!</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>{modalMessage}</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => setShowModal(false)}
                >
                  Ok
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">Confirmar Exclusão</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Tem certeza que deseja excluir este morador?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={confirmDelete}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
