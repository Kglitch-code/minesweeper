import unittest
from socketio import Client

class TestRoomEvents(unittest.TestCase):
    def test_user_join(self):
        client = Client()
        client.connect('http://localhost:5000')
        client.emit('join', {'username': 'testuser', 'room_code': '1234'})
        
        # Implement a listener in your test to check the server response
        @client.on('update_user_list')
        def handle_user_list(data):
            self.assertIn('testuser', data['users'])
        
        client.disconnect()

if __name__ == '__main__':
    unittest.main()
