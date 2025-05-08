<script setup>
// Footer component
</script>

<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-section">
        <img src="/inspedralbes.jpg" alt="Institut Pedralbes Logo" class="footer-logo" />
      </div>
      <div class="footer-section">
        <h3>Institut Pedralbes</h3>
        <p>Avinguda d'Esplugues, 40</p>
        <p>08034 Barcelona</p>
      </div>
      <div class="footer-section">
        <p class="copyright"> 2025/2026</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: #1a237e;
  color: white;
  padding: 2rem 0;
  width: 100%;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
  padding: 0 1rem;
}

.footer-section {
  text-align: center;
}

.footer-logo {
  max-width: 150px;
  height: auto;
}

h3 {
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

p {
  margin: 0.25rem 0;
  font-size: 1rem;
}

.copyright {
  font-size: 0.9rem;
  opacity: 0.9;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: 1.5rem;
  }
}
</style>
