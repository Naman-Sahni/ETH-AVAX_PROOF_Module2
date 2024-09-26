// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract EventManagementSystem {
    struct Event {
        uint eventId;
        string name;         // Name of the event
        string description;  // Description of the event
        uint maxCapacity;    // Maximum number of attendees
        uint registeredCount; // Number of registered attendees
        bool isActive;       // Whether registration for the event is still active
    }

    mapping(uint => Event) public events;
    mapping(address => mapping(uint => bool)) public isRegistered;  // Tracks if a user is registered for an event
    uint public eventCount;

    event EventAdded(uint eventId, string name, string description, uint maxCapacity);
    event Registered(address attendee, uint eventId);
    event RegistrationClosed(uint eventId);

    // Function to add a new event
    function addEvent(string memory name, string memory description, uint maxCapacity) public {
        require(bytes(name).length > 0, "Event name cannot be empty");
        require(bytes(description).length > 0, "Event description cannot be empty");
        require(maxCapacity > 0, "Event must have a positive maximum capacity");

        eventCount++;
        events[eventCount] = Event(eventCount, name, description, maxCapacity, 0, true);

        emit EventAdded(eventCount, name, description, maxCapacity);
    }

    // Function to register for an event
    function registerForEvent(uint eventId) public {
        Event storage _event = events[eventId];

        // Ensure that the event exists and registration is still active
        require(_event.eventId != 0, "Event does not exist");
        require(_event.isActive, "Registration for this event is closed");
        require(_event.registeredCount < _event.maxCapacity, "Event is full");

        // Ensure the user has not already registered for this event
        require(!isRegistered[msg.sender][eventId], "You are already registered for this event");

        // Increase the registered count and mark the user as registered
        _event.registeredCount++;
        isRegistered[msg.sender][eventId] = true;

        emit Registered(msg.sender, eventId);
    }

    // Function to close registration for an event
    function closeRegistration(uint eventId) public {
        Event storage _event = events[eventId];

        // Ensure that the event exists
        require(_event.eventId != 0, "Event does not exist");

        // Mark the event as inactive, meaning registration is closed
        _event.isActive = false;

        emit RegistrationClosed(eventId);
    }

    // Function to check if registration is open for an event
    function isRegistrationOpen(uint eventId) public view returns (bool) {
        Event storage _event = events[eventId];
        require(_event.eventId != 0, "Event does not exist");
        return _event.isActive; // Returns true if registration is still active
    }

    // Function to check the number of registered attendees for an event
    function checkRegisteredCount(uint eventId) public view returns (uint) {
        Event storage _event = events[eventId];

        // Ensure that the event exists
        require(_event.eventId != 0, "Event does not exist");

        return _event.registeredCount;
    }

    // Internal function to ensure event state consistency
    function internalCheck(uint eventId) internal view {
        Event storage _event = events[eventId];
        assert(_event.eventId > 0);  // Assert the event ID should always be positive
        assert(_event.isActive == false || _event.isActive == true);  // Assert that isActive is either true or false
    }
}
