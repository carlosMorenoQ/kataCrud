import React, {
  useContext,
  useReducer,
  useEffect,
  useRef,
  useState,
  createContext,
} from "react";
import Header from "./components/Header";
/************************* ↓ contexto ↓ ***************************************/
const HOST_API = "http://localhost:8080/api";
const initialState = {
  list: [],
  item: {},
};
const Store = createContext(initialState);
/************************* ↑ contexto ↑ ***************************************/
/************************* ↓ componentForm ↓ **********************************/
const Form = () => {
  const formRef = useRef(null);
  const {
    dispatch,
    state: { item },
  } = useContext(Store);
  const [state, setState] = useState(item);

  const onAdd = (event) => {
    event.preventDefault();

    const request = {
      name: state.name,
      id: null,
      isCompleted: false,
    };

    fetch(HOST_API + "/todo", {
      method: "POST",
      body: JSON.stringify(request),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((todo) => {
        dispatch({ type: "add-item", item: todo });
        setState({ name: "" });
        formRef.current.reset();
      });
  };

  const onEdit = (event) => {
    event.preventDefault();

    const request = {
      name: state.name,
      id: item.id,
      isCompleted: item.isCompleted,
    };

    fetch(HOST_API + "/todo", {
      method: "PUT",
      body: JSON.stringify(request),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((todo) => {
        dispatch({ type: "update-item", item: todo });
        setState({ name: "" });
        formRef.current.reset();
      });
  };

  return (
    <div className="container m-10">
      <form ref={formRef}>
        <div class="row g-6 align-items-center">
          <div className="col-auto">
            <input
              type="text"
              name="name"
              defaultValue={item.name}
              onChange={(event) => {
                setState({ ...state, name: event.target.value });
              }}
            ></input>
          </div>
          {item.id && (
            <button onClick={onEdit} className="col-auto">
              Actualizar
            </button>
          )}
          {!item.id && (
            <button onClick={onAdd} className="col-auto">
              Agregar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
/************************* ↑ componentForm ↑ **********************************/
/************************* ↓ componentList ↓ **********************************/
const List = () => {
  const { dispatch, state } = useContext(Store);

  useEffect(() => {
    fetch(HOST_API + "/todos")
      .then((response) => response.json())
      .then((list) => {
        dispatch({ type: "update-list", list });
      });
  }, [state.list.length, dispatch]);

  const onDelete = (id) => {
    fetch(HOST_API + "/" + id + "/todo", {
      method: "DELETE",
    }).then((list) => {
      dispatch({ type: "delete-item", id });
    });
  };

  const onEdit = (todo) => {
    dispatch({ type: "edit-item", item: todo });
  };

  return (
    <div className="container mt-20">
      <table class="table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Nombre</th>
            <th scope="col">¿Está completado?</th>
          </tr>
        </thead>
        <tbody>
          {state.list.map((todo) => {
            return (
              <tr key={todo.id}>
                <th scope="row">{todo.id}</th>
                <td>{todo.name}</td>
                <td>{todo.isComplete === true ? "SI" : "NO"}</td>
                <td>
                  <button onClick={() => onDelete(todo.id)}>Eliminar</button>
                </td>
                <td>
                  <button onClick={() => onEdit(todo)}>Editar</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
/************************* ↑ componentList ↑ **********************************/
/*************************** ↓ reducer ↓ *****************************************/
function reducer(state, action) {
  switch (action.type) {
    case "update-item":
      const listUpdateEdit = state.list.map((item) => {
        if (item.id === action.item.id) {
          return action.item;
        }
        return item;
      });
      return { ...state, list: listUpdateEdit, item: {} };

    case "delete-item":
      const listUpdate = state.list.filter((item) => {
        return item.id !== action.id;
      });
      return { ...state, list: listUpdate };
    case "update-list":
      return { ...state, list: action.list };
    case "edit-item":
      return { ...state, item: action.item };
    case "add-item":
      const newList = state.list;
      newList.push(action.item);
      return { ...state, list: newList };
    default:
      return state;
  }
}
/*************************** ↑ reducer ↑ *****************************************/
/*************************** ↓ provider ↓ *****************************************/
const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <Store.Provider value={{ state, dispatch }}>{children}</Store.Provider>
  );
};
// /*************************** ↑ provider ↑ *****************************************/

function App() {
  return (
    <StoreProvider>
      <Header />
      <Form />
      <List />
    </StoreProvider>
  );
}

export default App;
