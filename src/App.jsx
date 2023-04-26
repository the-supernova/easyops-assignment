import { useState, useEffect } from "react";

function App() {
  const [data, setData] = useState([]);
  const [searchedData, setSearchedData] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = e.target.firstName.value + ' ' + e.target.lastName.value;
    const contact = e.target.contact.value;
    const isDuplicate = data.some(person => person.name.toLowerCase() === name.toLowerCase() || person.contact === contact)
    if (isDuplicate) {
      alert('Duplicate entry')
      return
    }
    const maxId = data.length ? Math.max(...data.map(person => person.id)) : 0;
    const changedData = [
      ...data,
      {
        id: maxId + 1,
        name,
        contact,
      },
    ];
    setData(changedData);
    localStorage.setItem('persons', JSON.stringify(changedData));
    e.target.firstName.value = ''
    e.target.lastName.value = ''
    e.target.contact.value = ''
  };

  const handleChange = (e) => {
    const query = e.target.value;
    const searchedInput = data.filter(person => person.name.toLowerCase().includes(query.toLowerCase()))
    setSearchedData(searchedInput)
  }

  const handleSort = () => {
    const sortedData = [...data].sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
    setData(sortedData);
    setData(sortedData.map((person, index) => ({...person, id: index + 1})))
  }

  const handleDelete = (e) => {
    if(!window.confirm('Are you sure?')) return
    const id = e.target.parentElement.firstChild.textContent;
    const changedData = data.filter(person => person.id !== parseInt(id));
    setData(changedData);
    const changedIdxData = changedData.map((person, index) => ({...person, id: index + 1}))
    setData(changedIdxData);
    localStorage.setItem('persons', JSON.stringify(changedIdxData));
  }

  const persons = searchedData.length ? searchedData : data;

  useEffect(() => {
    const persons = localStorage.getItem('persons');
    if (persons) {
      setData(JSON.parse(persons));
    }
  }, []);

  return (
    <div className="flex flex-col gap-4 items-center justify-center">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <label>Person's Name</label>
          <div className="flex gap-2">
            <input
              className="w-[60%] border-2"
              type="text"
              name="firstName"
              placeholder="First"
              required
            />
            <input
              className="w-full border-2"
              type="text"
              name="lastName"
              placeholder="Last"
              required
            />
          </div>
        </div>
        <div className="flex flex-col">
          <label>Contact Number</label>
          <input className="border-2" type="text" name="contact" required/>
        </div>
        <button type="submit" className="p-2 border-2 rounded-md bg-slate-300">
          Save
        </button>
      </form>

      <input className="rounded-lg border-2" placeholder="search" onChange={handleChange} />

      <table className="w-[50%]">
        <tbody>
          <tr className="bg-[#f3f3f3]">
            <th className="p-2 text-left">SN.</th>
            <th className="p-2 text-left cursor-pointer" onClick={handleSort}>Name</th>
            <th className="p-2 text-left">Contact</th>
            <th className="p-2 text-left">Delete</th>
          </tr>
          {persons.map(person => (
            <tr key={person.id}>
              <td className="p-2">{person.id}</td>
              <td className="p-2">{person.name}</td>
              <td className="p-2">{person.contact}</td>
              <td className="p-2 cursor-pointer" onClick={handleDelete}>x</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
