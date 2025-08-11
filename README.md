<img width="767" height="304" alt="Screenshot 2025-08-11 at 8 19 29 pm" src="https://github.com/user-attachments/assets/88c03e83-49e1-48dd-8194-1111d2547efe" /># 🎨 Art Gallery and Marketplace Web Application

## Abstract
Due to the lack of fine art galleries and creative exhibits, artists in this country are severely constrained in how, when, and where they can sell and exhibit their work.  
This project is a **Node.js web application** that connects artists with art enthusiasts, enabling them to:
- Showcase and sell their artwork online
- Reach a wider audience
- Allow customers to browse, discover, and purchase artworks

**Features:**
- Artists can create profiles, upload and manage their artworks
- Customers can browse artworks, add them to a cart, and checkout
- Admin can manage artworks and remove non-original content

---

## Implementation & Pages

Below are the main pages of the application. Each section includes a brief description and a screenshot.

### 1. Sign Up Page
A user can sign up as either:
- **Artist** → Upload and sell artwork
- **Customer** → Browse and purchase artworks  
<img width="897" height="366" alt="Screenshot 2025-08-11 at 7 57 49 pm" src="https://github.com/user-attachments/assets/b1d6bff0-3b55-46a8-bb57-7fb3cee23cc5" />


---

### 2. Login Page
Shared login for all roles: **Admin, Artist, Customer**  
<img width="918" height="334" alt="Screenshot 2025-08-11 at 8 01 34 pm" src="https://github.com/user-attachments/assets/55059327-e381-427c-9813-d691f66d7d6a" />


---

### 3. Shop (Artist View)
Navbar shows **Add Artwork** and **Profile** tabs (only for artists).  
Artists can browse other artworks but cannot edit them.  
<img width="806" height="480" alt="Screenshot 2025-08-11 at 8 04 48 pm" src="https://github.com/user-attachments/assets/2f4273c2-0a88-4f88-ac5b-f4a87d2f4c0a" />


---

### 4. Artwork Details Page
View artwork details including title, price, and artist information.  
<img width="794" height="396" alt="Screenshot 2025-08-11 at 8 05 59 pm" src="https://github.com/user-attachments/assets/aacaad26-dbc9-46a8-81b8-053bbda05f24" />


---

### 5. Add Artwork Page (Artist)
Artists can upload an image, set price, title, and other details.  
<img width="766" height="506" alt="Screenshot 2025-08-11 at 8 05 19 pm" src="https://github.com/user-attachments/assets/05588a92-1c32-4d80-80e9-f72371df5138" />


---

### 6. Edit/Update Artwork Page (Artist)
Artists can modify their existing artworks.  
<img width="797" height="514" alt="Screenshot 2025-08-11 at 8 05 40 pm" src="https://github.com/user-attachments/assets/0aa86c4c-701a-491b-997f-b60ee3daf661" />


---

### 7. Shop (Customer View)
Navbar shows **Cart** and **Orders** tabs (only for customers).  
Customers can browse artworks and add them to their cart.  

<img width="740" height="428" alt="Screenshot 2025-08-11 at 8 06 23 pm" src="https://github.com/user-attachments/assets/267ab789-54a5-4780-baca-3d25c7fddbf2" />

---

### 8. Cart Page (Customer)
Displays artworks in the cart and their quantities. 
<img width="767" height="308" alt="Screenshot 2025-08-11 at 8 20 23 pm" src="https://github.com/user-attachments/assets/b2c7d13d-2a28-416d-8f05-73af04c3c466" />


---

### 9. Orders Page (Customer)
Shows the final list of purchased artworks and total price.  
<img width="766" height="371" alt="Screenshot 2025-08-11 at 8 20 46 pm" src="https://github.com/user-attachments/assets/81fa2401-2412-4910-aae6-3fbb8c8a65db" />



---

### 10. Checkout Page (Customer)
Checkout process using **Stripe API** (test mode).  

<img width="806" height="441" alt="Screenshot 2025-08-11 at 8 21 24 pm" src="https://github.com/user-attachments/assets/498cf00e-cc72-4db6-84cc-d80f9570a719" />


---

### 11. Admin – Delete Artwork Page
Admin can delete any artwork non-original.  
<img width="757" height="405" alt="Screenshot 2025-08-11 at 8 21 41 pm" src="https://github.com/user-attachments/assets/c5474e76-99ca-4698-ab9e-235e64113194" />



---

## 🛠️ Tech Stack
- **Backend:** Node.js, Express
- **Frontend:** EJS Templating Engine
- **Database:** MongoDB
- **Payments:** Stripe API (test mode)
- **Authentication:** session-based



