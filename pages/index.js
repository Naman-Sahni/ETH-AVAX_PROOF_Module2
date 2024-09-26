import { useState, useEffect } from "react";
import { ethers } from "ethers";
import EventManagementSystemAbi from "../artifacts/contracts/EventManagementSystem.sol/EventManagementSystem.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [eventManagementSystem, setEventManagementSystem] = useState(undefined);
  const [eventDetails, setEventDetails] = useState({});
  const [message, setMessage] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventCapacity, setEventCapacity] = useState("");
  const [eventId, setEventId] = useState("");

  const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // Update with your contract address
  const eventManagementSystemABI = EventManagementSystemAbi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
    }
  };

  const handleAccount = (accounts) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
    } else {
      setAccount(undefined);
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    try {
      const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
      handleAccount(accounts);
      getEventManagementSystemContract();
    } catch (error) {
      setMessage("Error connecting account: " + (error.message || error));
    }
  };

  const getEventManagementSystemContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const eventManagementSystemContract = new ethers.Contract(contractAddress, eventManagementSystemABI, signer);
    setEventManagementSystem(eventManagementSystemContract);
  };

  const addEvent = async () => {
    setMessage("");
    if (eventManagementSystem) {
      try {
        let tx = await eventManagementSystem.addEvent(eventName, eventDescription, parseInt(eventCapacity));
        await tx.wait();
        setMessage("Event added successfully!");
      } catch (error) {
        setMessage("Error adding event: " + (error.message || error));
      }
    }
  };

  const registerForEvent = async () => {
    setMessage("");
    if (eventManagementSystem) {
      try {
        let tx = await eventManagementSystem.registerForEvent(parseInt(eventId));
        await tx.wait();
        setMessage("Registered for the event successfully!");
      } catch (error) {
        setMessage("Error registering for event: " + (error.message || error));
      }
    }
  };

  const closeEventRegistration = async () => {
    setMessage("");
    if (eventManagementSystem) {
      try {
        let tx = await eventManagementSystem.closeRegistration(parseInt(eventId));
        await tx.wait();
        setMessage("Event registration closed successfully!");
      } catch (error) {
        setMessage("Unable to close event registration: " + (error.message || error));
      }
    }
  };

  const checkEventDetails = async (eventId) => {
    try {
      if (eventManagementSystem) {
        const event = await eventManagementSystem.events(eventId);
        setEventDetails({
          name: event.name,
          description: event.description,
          capacity: event.maxCapacity.toString(),
          registeredCount: event.registeredCount.toString(),
          isActive: event.isActive
        });
      }
    } catch (error) {
      setMessage("Error fetching event details: " + (error.message || error));
    }
  };

  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install MetaMask to use this event management system.</p>;
    }

    if (!account) {
      return <button onClick={connectAccount}>Connect MetaMask Wallet</button>;
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <div className="event-actions">
          <input
            type="text"
            placeholder="Event Name"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Event Description"
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
          />
          <input
            type="number"
            placeholder="Event Capacity"
            value={eventCapacity}
            onChange={(e) => setEventCapacity(e.target.value)}
          />
          <button onClick={addEvent}>Add Event</button>

          <input
            type="number"
            placeholder="Event ID"
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
          />
          <button onClick={registerForEvent}>Register for Event</button>
          <button onClick={closeEventRegistration}>Close Registration</button>

          <div className="event-info">
            {eventId && (
              <div>
                <p>Event Name: {eventDetails.name}</p>
                <p>Description: {eventDetails.description}</p>
                <p>Max Capacity: {eventDetails.capacity}</p>
                <p>Registered Count: {eventDetails.registeredCount}</p>
                <p>Registration Active: {eventDetails.isActive ? "Yes" : "No"}</p>
              </div>
            )}
          </div>
        </div>
        {message && <p><strong>{message}</strong></p>}
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Welcome to Event Management System</h1>
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
          background-color: white;
          color: black;
          font-family: "Times New Roman", serif;
          border: 10px solid black;
          border-radius: 20px;
          background-image: url("https://i.pinimg.com/736x/fc/88/d9/fc88d9a1cd6633ab5b1eefec067ec455.jpg");
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          height: 850px;
          width: 1500px;
          opacity: 0.9;
          font-weight: 1000;
          padding: 20px;
        }

        header {
          padding: 10px;
        }

        h1 {
          font-family: "Arial", serif;
          font-size: 60px;
          margin-bottom: 20px;
        }

        .event-info {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        button {
          background-color: #4caf50;
          color: white;
          border: none;
          padding: 15px 25px;
          font-size: 22px;
          cursor: pointer;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        button:hover {
          background-color: #388e3c;
        }
      `}</style>
    </main>
  );
}
