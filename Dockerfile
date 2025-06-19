# 1. ใช้ Node base image
FROM node:20-alpine

# 2. ตั้ง working directory
WORKDIR /app

# 3. คัดลอก dependencies
COPY package.json package-lock.json* ./

# 4. ติดตั้ง
RUN npm install

# 5. คัดลอกไฟล์ทั้งหมด
COPY . .

# 6. เปิด hot reload
EXPOSE 3000

# 7. สั่งรัน dev server
CMD ["npm", "run", "dev"]
