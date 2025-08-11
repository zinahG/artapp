# 🎨 Art Gallery and Marketplace Web Application

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


---

### 2. Login Page
Shared login for all roles: **Admin, Artist, Customer**  


---

### 3. Shop (Artist View)
Navbar shows **Add Artwork** and **Profile** tabs (only for artists).  
Artists can browse other artworks but cannot edit them.  


---

### 4. Artwork Details Page
View artwork details including title, price, and artist information.  


---

### 5. Add Artwork Page (Artist)
Artists can upload an image, set price, title, and other details.  


---

### 6. Edit/Update Artwork Page (Artist)
Artists can modify their existing artworks.  


---

### 7. Shop (Customer View)
Navbar shows **Cart** and **Orders** tabs (only for customers).  
Customers can browse artworks and add them to their cart.  


---

### 8. Cart Page (Customer)
Displays artworks in the cart and their quantities.  


---

### 9. Orders Page (Customer)
Shows the final list of purchased artworks and total price.  


---

### 10. Checkout Page (Customer)
Checkout process using **Stripe API** (test mode).  


---

### 11. Admin – Delete Artwork Page
Admin can delete any artwork flagged as non-original.  


---

## 🛠️ Tech Stack
- **Backend:** Node.js, Express
- **Frontend:** HTML, CSS, JavaScript
- **Database:** MongoDB
- **Payments:** Stripe API (test mode)
- **Authentication:** JWT-based



