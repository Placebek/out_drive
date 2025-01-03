from fastapi import  WebSocket
from typing import List, Dict
import json


class WebsocketManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, data):
        print('waaiiiittt', self.active_connections)
        for connection in self.active_connections:
            try:
                list_data = [dict(i) for i in data]
                print('www', list_data,)
                await connection.send_json(list_data)
            except Exception as e:
                print(f"Broadcast failed for {connection}: {e}")
                self.disconnect(connection)
            
manager = WebsocketManager()



class WebsocketClientDriver:
    def __init__(self):
        self.active_clients: List[Dict] = []  # Список клиентов
        self.active_drivers: List[Dict] = []  # Список водителей
        self.client_driver_pairs: Dict[str, str] = {}  # Словарь связей клиент-водитель

    async def connect(self, websocket: WebSocket, data):
        """Метод для подключения клиента или водителя."""
        # await websocket.accept()
        # initial_message = await websocket.receive_text()
        # data = json.loads(initial_message)
        user_id = data["id"]
        user_type = data["userType"]

        if user_type == "client":
            self.active_clients.append({"client_id": user_id, "websocket": websocket})
        elif user_type == "driver":
            self.active_drivers.append({"driver_id": user_id, "websocket": websocket})
        print(f"Connected: {user_type} with ID {user_id}")


    def disconnect(self, websocket: WebSocket):
        """Метод для отключения клиента или водителя."""
        for client in self.active_clients:
            if client["websocket"] == websocket:
                self.active_clients.remove(client)
                print(f"Client with ID {client['client_id']} disconnected")
                return

        for driver in self.active_drivers:
            if driver["websocket"] == websocket:
                self.active_drivers.remove(driver)
                print(f"Driver with ID {driver['driver_id']} disconnected")
                return


    def pair_client_and_driver(self, client_id: str, driver_id: str):
        print('weewwe')
        self.client_driver_pairs[client_id] = driver_id
        print(f"Paired Client {client_id} with Driver {driver_id}")

    async def send_to_pair(self, client_id: str, data: dict):
        """Отправляет данные только клиенту (не водителю)."""
        driver_id = self.client_driver_pairs.get(client_id)
        print('qqq0', data)

        if not driver_id:
            print(f"No driver found for client {client_id}")
            return

        client_ws = next(
            (c["websocket"] for c in self.active_clients if c["client_id"] == client_id),
            None,
        )

        if client_ws:
            try:
                await client_ws.send_text(json.dumps(data))
            except Exception as e:
                print(f"Error sending message to client {client_id}: {e}")
                self.disconnect(client_ws)



manager_orders = WebsocketClientDriver()