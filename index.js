const form = document.querySelector('form');
const name = document.querySelector('#name');
const message = document.querySelector('#message');
const tableBody = document.querySelector('#postsTable tbody');

// Supabase Configuration
const SUPABASE_URL = 'https://jdbulotrjihbbyprkhup.supabase.co';
const SUPABASE_KEY = 'sb_publishable_8fsvLYURkz0g2eBSiAlx-w_JittDASK';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    let messageData = message.value 
    let nameData = name.value

    // Insert into Supabase
    const { data, error } = await supabaseClient
        .from('user_posts')
        .insert([{ name: nameData, message: messageData }]);

    if (error) {
        console.error('Error inserting data:', error);
        alert('Failed to send message: ' + error.message);
    } else {
        console.log('Data inserted successfully:', data);
        form.reset();
        fetchUserPosts();
    }
});

// Fetch data from Supabase and print it on the UI
async function fetchUserPosts() {
    const { data, error } = await supabaseClient
        .from('user_posts')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching data:', error);
        return;
    }

    tableBody.innerHTML = '';
    data.forEach(userPostRecord => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${userPostRecord.name}</td>
            <td>${userPostRecord.message}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Initial fetch on page load
fetchUserPosts();
