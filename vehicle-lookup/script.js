document.addEventListener('DOMContentLoaded', () => {
    const provinceSelect = document.getElementById('province-select');
    const form = document.getElementById('plate-form');
    const result = document.getElementById('result');
  
    // Lấy danh sách các tỉnh từ server
    fetch('/api/provinces')
      .then(response => response.json())
      .then(provinces => {
        provinces.forEach(province => {
          const option = document.createElement('option');
          option.value = province;
          option.textContent = province;
          provinceSelect.appendChild(option);
        });
      })
      .catch(error => console.error('Error fetching provinces:', error));
  
    // Gửi request khi submit form
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const selectedProvince = provinceSelect.value;
  
      fetch('/api/plate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `province=${selectedProvince}`,
      })
        .then(response => response.json())
        .then(data => {
          result.textContent = `Biển số xe: ${data.plate}`;
        })
        .catch(error => {
          result.textContent = 'Không tìm thấy biển số';
          console.error('Error fetching plate:', error);
        });
    });
  });
  