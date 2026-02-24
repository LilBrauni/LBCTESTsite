// Класс для управления постами
class SocialNetwork {
    constructor() {
        this.posts = JSON.parse(localStorage.getItem('posts')) || [];
        this.init();
    }

    init() {
        this.renderPosts();
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('publishBtn').addEventListener('click', () => {
            this.createPost();
        });

        document.getElementById('postInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.createPost();
            }
        });
    }

    createPost() {
        const input = document.getElementById('postInput');
        const content = input.value.trim();

        if (content) {
            const post = {
                id: Date.now(),
                author: 'Гость',
                authorAvatar: 'https://via.placeholder.com/50',
                content: content,
                likes: 0,
                comments: 0,
                liked: false,
                timestamp: new Date().toLocaleString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit',
                    day: 'numeric',
                    month: 'long'
                })
            };

            this.posts.unshift(post);
            this.savePosts();
            this.renderPosts();
            input.value = '';

            // Анимация добавления поста
            this.showNotification('Пост опубликован!');
        }
    }

    deletePost(postId) {
        this.posts = this.posts.filter(post => post.id !== postId);
        this.savePosts();
        this.renderPosts();
        this.showNotification('Пост удален');
    }

    likePost(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (post) {
            if (post.liked) {
                post.likes--;
                post.liked = false;
            } else {
                post.likes++;
                post.liked = true;
            }
            this.savePosts();
            this.renderPosts();
        }
    }

    savePosts() {
        localStorage.setItem('posts', JSON.stringify(this.posts));
    }

    showNotification(message) {
        // Создаем уведомление
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            padding: 1rem 2rem;
            border-radius: 50px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 2000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    renderPosts() {
        const feed = document.getElementById('postsFeed');
        
        if (this.posts.length === 0) {
            feed.innerHTML = `
                <div class="post" style="text-align: center; padding: 3rem;">
                    <i class="fas fa-newspaper" style="font-size: 4rem; color: #ddd; margin-bottom: 1rem;"></i>
                    <h3 style="color: #666;">Пока нет постов</h3>
                    <p style="color: #999;">Будьте первым, кто опубликует запись!</p>
                </div>
            `;
            return;
        }

        feed.innerHTML = this.posts.map(post => `
            <div class="post" data-id="${post.id}" style="animation: fadeIn 0.5s ease;">
                <div class="post-header">
                    <div class="post-user">
                        <img src="${post.authorAvatar}" alt="avatar">
                        <div class="post-user-info">
                            <h4>${post.author}</h4>
                            <span>${post.timestamp}</span>
                        </div>
                    </div>
                    <button class="action-btn" onclick="app.deletePost(${post.id})">
                        <i class="fas fa-ellipsis-h"></i>
                    </button>
                </div>
                <div class="post-content">
                    ${post.content}
                </div>
                <div class="post-actions">
                    <button class="${post.liked ? 'liked' : ''}" onclick="app.likePost(${post.id})">
                        <i class="fas fa-heart"></i>
                        <span>${post.likes}</span>
                    </button>
                    <button>
                        <i class="fas fa-comment"></i>
                        <span>${post.comments}</span>
                    </button>
                    <button>
                        <i class="fas fa-share"></i>
                        <span>Поделиться</span>
                    </button>
                </div>
            </div>
        `).join('');
    }
}

// Добавляем стили для анимаций
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Инициализация приложения
const app = new SocialNetwork();

// Добавляем пример поста для демонстрации
if (app.posts.length === 0) {
    const demoPost = {
        id: Date.now(),
        author: 'Гость',
        authorAvatar: 'https://via.placeholder.com/50',
        content: 'Добро пожаловать в нашу социальную сеть! 🎉 Здесь вы можете делиться своими мыслями, общаться с друзьями и находить новых знакомых. Начните общение прямо сейчас!',
        likes: 5,
        comments: 2,
        liked: false,
        timestamp: new Date().toLocaleString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
            day: 'numeric',
            month: 'long'
        })
    };
    app.posts.push(demoPost);
    app.savePosts();
    app.renderPosts();
}
