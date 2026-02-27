import { useEffect, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router";

function Expenses() {
  const [formView, setFormView] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [userData, setUserData] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mode, setMode] = useState("credit");
  const [amount, setAmount] = useState("");

  const [deletedIds, setDeletedIds] = useState([]);
  const navigate = useNavigate();

  const fetchExpenses = () => {
    const data = JSON.parse(localStorage.getItem("authToken"));
    if (!data) {
      return navigate("/");
    }

    setUserData(data.data.user._id);

    axios
      .get("https://finance-tracker-backend-imyy.onrender.com/api/expenses/", {
        headers: { "Content-Type": "application/json" },
        params: { user: data.data.user._id },
      })
      .then((res) => {
        setExpenses(res.data.data.expenses);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !mode || !amount) {
      return window.alert("Please fill all required fields");
    }

    const data = {
      title,
      description,
      mode: mode.toLowerCase(),
      amount: parseInt(amount),
      user: userData,
    };

    try {
      await axios.post(
        "https://finance-tracker-backend-imyy.onrender.com/api/expenses",
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      fetchExpenses();
      resetForm();
    } catch (err) {
      window.alert(err.message);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setMode("credit");
    setAmount("");
    setFormView(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      setDeletedIds((prev) => [...prev, id]);
    }
  };

  return (
    <div>
      <div className="text-base sm:text-xl">
        Your credits and debits this month ...
      </div>
      <div className="my-5">
        {!formView && (
          <button
            onClick={() => {
              resetForm();
              setFormView(true);
            }}
            className="w-full flex items-center bg-[#C7C8CC] text-left py-3 px-3 rounded-sm hover:bg-[#B4B4B8] hover:scale-[1.01] transition duration-100"
          >
            <FaPlus className="mr-2" />
            Add new expense
          </button>
        )}

        {formView && (
          <div className="bg-[#A0E9FF] p-3 sm:p-5 rounded-md">
            <div className="text-md sm:text-xl my-2">Title</div>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 rounded-md"
            />

            <div className="text-md sm:text-xl my-2">Description</div>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 rounded-md"
            />

            <div className="text-md sm:text-xl my-2">Mode of expense</div>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="w-full p-2 rounded-md"
            >
              <option value="credit">Credit</option>
              <option value="debit">Debit</option>
            </select>

            <div className="text-md sm:text-xl my-2">Amount</div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 rounded-md"
            />

            <div className="flex justify-end mt-3">
              <button
                onClick={() => resetForm()}
                className="w-24 p-2 bg-[#EF4040] mr-3 rounded-md hover:scale-[1.05] hover:bg-[#B31312] transition ease-in-out duration-100"
              >
                Cancel
              </button>
              <button
                onClick={handleFormSubmit}
                className="w-24 p-2 bg-[#87A922] rounded-md hover:scale-[1.05] hover:bg-[#416D19] transition ease-in-out duration-100"
              >
                Save
              </button>
            </div>
          </div>
        )}

        <div className="my-10 space-y-2">
          {expenses
            .filter((el) => !deletedIds.includes(el._id))
            .map((el) => (
              <div
                key={el._id}
                className="w-full flex flex-col sm:flex-row sm:items-center justify-between bg-[#BEFFF7] text-left py-3 px-3 rounded-sm hover:bg-[#96EFFF] hover:scale-[1.01] transition duration-100"
              >
                <div className="flex-1">
                  <div className="font-semibold">{el.title}</div>
                  <div className="text-sm text-gray-700">{el.description}</div>
                </div>
                <div className="flex items-center gap-4 mt-2 sm:mt-0">
                  <div
                    className={`font-semibold ${
                      el.mode === "credit" ? "text-red-500" : "text-green-500"
                    }`}
                  >
                    {el.mode === "credit" ? "-" : "+"} ₹ {el.amount}
                  </div>
                  <button
                    onClick={() => handleDelete(el._id)}
                    className="text-red-600"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Expenses;
