# Node-based-Programming
Heavy use of maps to build a node-based programming app for statisticians. 

Directed towards Spotify for now. 

4 / 22
Pushed current progress to Git. 
Sign in with Spotify works with django (login flow) 
Data base set up. 
Vite able to make correct API requests to backend. 
Login screen / introduction screen set up 
Set up base functions of dragging nodes, resizing screen, dragging screen, connecting nodes, and recording data and being able to access nodes sequentially. 

<img width="1185" alt="Screenshot 2024-04-22 at 5 23 51 PM" src="https://github.com/ANYhackerfort/Node-based-Programming/assets/22162162/10f75db9-0791-46a8-a71f-4d4dddfb86cb">
<img width="977" alt="Screenshot 2024-04-22 at 5 24 06 PM" src="https://github.com/ANYhackerfort/Node-based-Programming/assets/22162162/b5f823a6-82b1-496b-9b2e-39fe1fd3a2ba">
<img width="1510" alt="Screenshot 2024-04-22 at 5 24 26 PM" src="https://github.com/ANYhackerfort/Node-based-Programming/assets/22162162/9fdbafe0-3250-464f-8a47-2b46067229ed">

_______
Connection to backend:
Requires you to change the base to static in vite.config.
Then runbuild and run through python3 manage.py runserver. 

export default defineConfig({
  plugins: [react()],
  // base: '/static/'
})

