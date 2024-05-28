// Import de bibliotecas
import './App.css';
import { BrowserRouter, Routes, Route, Outlet, useNavigate, useParams } from "react-router-dom";
import { useState , useEffect } from 'react';
import { Container, Form, Button, Table, Nav } from 'react-bootstrap';

// Define o endereço do servidor
const endereco_servidor = 'http://localhost:8000';

/**
 * Layout do menu.
 * 
 * @returns 
 */
function Layout(){
  
  // Renderiza o componente
  return (
    <>
      <Container>
        <h1>Menu principal</h1>
        <Nav defaultActiveKey="/" className="bg-light flex-column">
          <Nav.Item as="incluir">
            <Nav.Link href="/frmcadastrocliente/-1">1. Incluir</Nav.Link>
          </Nav.Item>
          <Nav.Item as="listar">
            <Nav.Link href="/frmlistarcliente">2. Listar(Alterar, Excluir)</Nav.Link>
          </Nav.Item>     
        </Nav>
        <hr />
        <Outlet />
      </Container>
    </>
  ) 
};

/**
 * Opção de página não encontrada.
 * 
 * @returns 
 */
function NoPage() {
  
  // Renderiza o componente
  return (
      <div>
        <h2>404 - Página não encontrada</h2>
      </div>
    );
};

/**
 * Componente formulário que insere ou altera cliente.
 * 
 * @returns 
 */
function FrmCadastroCliente(){

  // Recupera o parâmetro do componente
  const { alterarId } = useParams();

  // Estados inciais das variáveis do componente   
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [resultado, setResultado] = useState('');  

  // Renderiza a lista de clientes.
  useEffect(() => {
    
    // Recupera um cliente para alteração
    const getCliente = async () => {
      //Se foi passado um parâmetro
      if (alterarId > 0) {      
        //Consulta o cliente
        const response = await fetch(`${endereco_servidor}/cliente/${alterarId}`);
        const data = await response.json();
        //Atualiza os dados        
        setNome(data.nome);
        setCpf(data.cpf);
      }      
    };

    //Se tem algum cliente para alterar, busca os dados do cliente.    
    getCliente(); 
  }, [alterarId]);

  // Submissão do formulário para inserir.
  const handleSubmitInsert = (event) => {

    // Impede o recarregamento da página
    event.preventDefault();   
    
    //Dados do formulário a serem enviados
    const dados =  { 
          //'clienteId': clienteId,
          'nome': nome,
          'cpf': cpf
    }

    //Endereço da API + campos em JSON
    fetch(`${endereco_servidor}/cliente`, {
        method : 'post',
        headers : {'Content-Type': 'application/json'},
        body: JSON.stringify(dados)}) //Converte os dados para JSON
       .then((response) => response.json()) //Converte a resposta para JSON
       .then((data) => setResultado(data.message)); // Atribui a resposta ao resultado
  
    // Limpa os campos do formulário.
    limpar();
  };

  // Submissão do formulário atualizar.
  const handleSubmitUpdate = (event) => {

    // Impede o recarregamento da página
    event.preventDefault();   
    
    const dados =  { 
          'nome': nome,
          'cpf': cpf
    };

    //Endereço da API + campos em JSON
    fetch(`${endereco_servidor}/cliente/${alterarId}`, {
        method : 'put',
        headers : {'Content-Type': 'application/json'},
        body: JSON.stringify(dados)}) //Converte os dados para JSON
       .then((response) => response.json()) //Converte a resposta para JSON
       .then((data) => setResultado(data.message)); // Atribui a resposta ao resultado
  
    // Limpa os campos do formulário.
    limpar();
  };

  // Limpa os campos do formulário.     
  const limpar = () => {     
    setNome('');
    setCpf('');
  };

  // Renderiza o componente formulário
  return (
    <>          
      <Form name="FrmCadastroCliente" method="post" onSubmit={alterarId < 0 ? handleSubmitInsert: handleSubmitUpdate}>
          <Form.Label><h2> {(alterarId < 0) ? (<div>1 - Formulário Cadastro Cliente</div>) : (<div>1 - Formulário Alteração Cliente</div>)} </h2></Form.Label>          
          <Form.Group>
            <Form.Label>Nome: 
            <Form.Control type="text" size="60" id="nome" name="nome" value={nome} onChange={(event) => setNome(event.target.value)} /></Form.Label><br/>
            <Form.Label>CPF: 
            <Form.Control type="text" size="15" id="cpf" name="cpf" value={cpf} onChange={(event) => setCpf(event.target.value)} /></Form.Label><br/><br/>
         </Form.Group>
          <Form.Group>
            <Button variant="secondary" name="Limpar" onClick={limpar}>Limpar</Button>
            <Button variant="primary" type="submit" name="Cadastrar">Cadastrar</Button><br/><br/>
          </Form.Group>
          <Form.Group>
            <Form.Label>Resultado: {resultado} </Form.Label>
          </Form.Group>
      </Form>
    </>
  );
};

/**
 * Componente de exclusão de cliente.
 * 
 * @returns 
 */
function FrmExcluirCliente() {

  // Recupera o parâmetro do componente
  const { clienteId } = useParams();

  // Estados inciais das variáveis do componente
  const [resultado, setResultado] = useState('');
  
  // Renderiza a lista de clientes.
  useEffect(() => {

    // Exclui um cliente
    const excluirCliente = async () => {
      //Endereço da API + campos em JSON
      fetch(`${endereco_servidor}/cliente/${clienteId}`, {method : 'delete'}) 
      .then((response) => response.json()) //Converte a resposta para JSON
      .then((data) => setResultado(data.message)); // Atribui a resposta ao resultado
    };

    excluirCliente();
  }, [clienteId]);

  // Renderiza o componente
  return (
    <div>      
       <label>Resultado: {resultado} </label>
    </div>
  );
}

/**
 * Componente de listagem de clientes.
 * 
 * @returns 
 */
function FrmListarCliente(){
  
  // Estados inciais das variáveis do componente
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([])
  
  // Renderiza a lista de clientes.
  useEffect(() => {
    // Busca os clientes cadastrados no servidor.
    const getClientes = () => {
      fetch(`${endereco_servidor}/clientes`)
        .then(response => {return response.json()}) //Converte a resposta para JSON
        .then(data => {setClientes(data)}) // Atribui a resposta ao cliente
    };

    getClientes();
  }, []);

  // Renderiza o componente
  return (
    <div>
        <h2>2 - Listar(Editar, Excluir)</h2>        
        <div>
          <Table striped bordered hover responsive> 
            <thead>
              <th>Id</th> <th>Nome</th> <th>CPF</th> <th>Editar</th> <th>Excluir</th>          
            </thead>  
            <tbody>
              {clientes.map(cliente => (
                <tr>
                  <td> {cliente.clienteId} </td>
                  <td> {cliente.nome}</td>
                  <td> {cliente.cpf}</td>
                  <td> 
                    <Button variant="primary" onClick={() => {navigate(`/frmcadastrocliente/${cliente.clienteId}`)}}>Editar</Button>
                  </td>                
                  <td>                  
                    <Button variant="primary" onClick={() => {navigate(`/frmexcluircliente/${cliente.clienteId}`)}}>Excluir</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <br/>          
        </div>
     </div>
  );
}

/**
 * Principal componente da aplicação.
 * 
 * @returns 
 */
function MenuPrincipal() {
    return (      
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route path='frmcadastrocliente/:alterarId' element={<FrmCadastroCliente />} />
            <Route path='frmexcluircliente/:clienteId' element={<FrmExcluirCliente />} />
            <Route path='frmlistarcliente' element={<FrmListarCliente />} />
            <Route path='*' element={<NoPage />} />
          </Route>
        </Routes>        
      </BrowserRouter>    
    );
  }
  
  export default MenuPrincipal;