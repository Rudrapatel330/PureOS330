/* ==========================================================================
   PURE OS - INTERACTIVE SYSTEM SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    /* --------------------------------------------------------------------------
       1. CUSTOM CURSOR TRACKER
       -------------------------------------------------------------------------- */
    const cursor = document.querySelector('.custom-cursor');
    const cursorGlow = document.querySelector('.custom-cursor-glow');
    
    if (cursor && cursorGlow) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
            
            cursorGlow.style.left = `${e.clientX}px`;
            cursorGlow.style.top = `${e.clientY}px`;
        });
        
        // Add hover effects for interactive elements
        const interactives = document.querySelectorAll('a, button, .interactive, .desktop-icon, .sidebar-folder, .vfs-item, .accent-dot, .wallpaper-item, .kernel-layer');
        interactives.forEach(item => {
            item.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
            item.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
        });
    }

    /* --------------------------------------------------------------------------
       2. SYSTEM GLOBAL THEME & ACCENTS (5 PREMIUM PALETTES)
       -------------------------------------------------------------------------- */
    const body = document.body;
    const themeSelectTrigger = document.getElementById('themeSelectTrigger');
    const themeSelectDropdown = document.getElementById('themeSelectDropdown');
    const themeOptions = document.querySelectorAll('.theme-option');
    const mobileThemeOptions = document.querySelectorAll('.mobile-theme-option');
    
    // Toggle dropdown
    if (themeSelectTrigger && themeSelectDropdown) {
        themeSelectTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            themeSelectDropdown.classList.toggle('open');
            playBeep(650, 0.04);
        });
        
        document.addEventListener('click', () => {
            themeSelectDropdown.classList.remove('open');
        });
        
        themeSelectDropdown.addEventListener('click', (e) => e.stopPropagation());
    }
    
    function applyTheme(themeName) {
        // Remove existing theme classes
        body.classList.remove('theme-obsidian', 'theme-ocean', 'theme-earth', 'theme-lilac', 'theme-carbon', 'theme-dark', 'theme-light');
        
        // Add selected theme class
        body.classList.add(`theme-${themeName}`);
        
        // Update active class in desktop dropdown options
        themeOptions.forEach(opt => {
            if (opt.dataset.theme === themeName) {
                opt.classList.add('active');
            } else {
                opt.classList.remove('active');
            }
        });
        
        // Update active class in mobile options tray
        mobileThemeOptions.forEach(opt => {
            if (opt.dataset.theme === themeName) {
                opt.classList.add('active');
            } else {
                opt.classList.remove('active');
            }
        });
        
        // Audio confirmation beep
        playBeep(880, 0.05);
        setTimeout(() => playBeep(1200, 0.05), 50);
        
        // Trigger SVG lines recalculation
        setTimeout(updatePointerLines, 100);
        
        // Auto-change desktop settings wallpapers for context integration
        const wallpaperGridItems = document.querySelectorAll('.wallpaper-item');
        if (wallpaperGridItems.length > 0) {
            let wpTargetName = 'dark-grid';
            if (themeName === 'ocean') wpTargetName = 'matrix';
            if (themeName === 'earth') wpTargetName = 'sunset';
            if (themeName === 'lilac') wpTargetName = 'pure-brutal';
            
            wallpaperGridItems.forEach(wp => {
                if (wp.dataset.wp === wpTargetName) {
                    wp.classList.add('active');
                    // Trigger actual wallpaper apply
                    if (wpTargetName === 'dark-grid') {
                        desktop.style.background = 'radial-gradient(circle, #1e1a10, #0e0c08)';
                    } else if (wpTargetName === 'matrix') {
                        desktop.style.background = 'radial-gradient(circle, #0e2a30, #06131e)';
                    } else if (wpTargetName === 'sunset') {
                        desktop.style.background = 'radial-gradient(circle, #2a1810, #110d0a)';
                    } else if (wpTargetName === 'pure-brutal') {
                        desktop.style.background = '#ede8f5';
                    }
                } else {
                    wp.classList.remove('active');
                }
            });
        }
    }
    
    // Bind desktop click events
    themeOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            const theme = opt.dataset.theme;
            applyTheme(theme);
            if (themeSelectDropdown) themeSelectDropdown.classList.remove('open');
        });
    });
    
    // Bind mobile click events
    mobileThemeOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            const theme = opt.dataset.theme;
            applyTheme(theme);
        });
    });
    
    // Bento theme color selector
    const bentoDots = document.querySelectorAll('.theme-picker-bento .color-dot');
    bentoDots.forEach(dot => {
        dot.addEventListener('click', () => {
            bentoDots.forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
            
            const color = dot.dataset.color;
            // Clear current accents
            body.classList.remove('accent-pink', 'accent-lime', 'accent-purple');
            if (color !== 'blue') {
                body.classList.add(`accent-${color}`);
            }
            
            // Sync with Settings app selector if open
            const settingsDots = document.querySelectorAll('.theme-accent-selectors .accent-dot');
            settingsDots.forEach(sd => {
                if (sd.dataset.accent === color) {
                    settingsDots.forEach(d => d.classList.remove('active'));
                    sd.classList.add('active');
                }
            });
        });
    });
    
    // Bento scale buttons
    const bentoScales = document.querySelectorAll('.scale-btn');
    bentoScales.forEach(btn => {
        btn.addEventListener('click', () => {
            bentoScales.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const scale = btn.dataset.scale;
            document.documentElement.style.setProperty('--os-gui-scale', scale);
            
            // Sync with Settings range slider if present
            const scaleSlider = document.getElementById('guiScaleSlider');
            const scaleValue = document.getElementById('guiScaleValue');
            if (scaleSlider && scaleValue) {
                scaleSlider.value = scale;
                scaleValue.innerText = `${scale}x`;
            }
            setTimeout(updatePointerLines, 150);
        });
    });

    /* --------------------------------------------------------------------------
       3. HERO LETTER HOVER PHYSICAL MAGNET EFFECT
       -------------------------------------------------------------------------- */
    const heroTitle = document.getElementById('heroTitle');
    const letters = document.querySelectorAll('.letter-interactive');
    
    if (heroTitle && letters.length > 0) {
        document.addEventListener('mousemove', (e) => {
            const mX = e.clientX;
            const mY = e.clientY;
            
            letters.forEach(letter => {
                const rect = letter.getBoundingClientRect();
                const lX = rect.left + rect.width / 2;
                const lY = rect.top + rect.height / 2;
                
                const distX = mX - lX;
                const distY = mY - lY;
                const dist = Math.sqrt(distX * distX + distY * distY);
                
                // If cursor is close, pull letter
                if (dist < 180) {
                    const power = (180 - dist) / 180; // 0 to 1
                    const pullX = distX * power * 0.22;
                    const pullY = distY * power * 0.22;
                    letter.style.transform = `translate(${pullX}px, ${pullY}px) scale(${1 + power * 0.1})`;
                    letter.style.color = 'var(--color-accent)';
                } else {
                    letter.style.transform = 'translate(0, 0) scale(1)';
                    letter.style.color = '';
                }
            });
        });
    }

    /* --------------------------------------------------------------------------
       4. DYNAMIC HERO CONNECTOR LINES (SVG DRIVEN)
       -------------------------------------------------------------------------- */
    const pointerSvg = document.getElementById('pointerLinesSvg');
    const line64 = document.getElementById('line-64bit');
    const lineAnim = document.getElementById('line-animations');
    
    const card64 = document.getElementById('callout-64bit');
    const cardAnim = document.getElementById('callout-animations');
    const letterP = document.getElementById('letter-p');
    const letterS = document.getElementById('letter-s');
    
    function updatePointerLines() {
        if (!pointerSvg || !line64 || !lineAnim || !card64 || !cardAnim || !letterP || !letterS) return;
        
        // Hide lines if hidden by media queries
        if (window.innerWidth <= 1024) {
            line64.setAttribute('d', 'M 0 0 L 0 0');
            lineAnim.setAttribute('d', 'M 0 0 L 0 0');
            return;
        }

        const svgRect = pointerSvg.getBoundingClientRect();
        
        // --- Line 1: 64Bit Card -> Letter P ---
        const rectCard64 = card64.getBoundingClientRect();
        const rectP = letterP.getBoundingClientRect();
        
        // Connection coords relative to SVG container
        const x1_64 = (rectCard64.left + rectCard64.width * 0.5) - svgRect.left;
        const y1_64 = (rectCard64.bottom) - svgRect.top;
        const x2_64 = (rectP.left + rectP.width * 0.5) - svgRect.left;
        const y2_64 = (rectP.top) - svgRect.top;
        
        // Create curved quadratic path
        const ctrlX_64 = x1_64 + (x2_64 - x1_64) * 0.2;
        const ctrlY_64 = y2_64 - 30;
        
        line64.setAttribute('d', `M ${x1_64} ${y1_64} Q ${ctrlX_64} ${ctrlY_64} ${x2_64} ${y2_64}`);
        
        // --- Line 2: Anim Card -> Letter S ---
        const rectCardAnim = cardAnim.getBoundingClientRect();
        const rectS = letterS.getBoundingClientRect();
        
        const x1_Anim = (rectCardAnim.left + rectCardAnim.width * 0.5) - svgRect.left;
        const y1_Anim = (rectCardAnim.top) - svgRect.top;
        const x2_Anim = (rectS.left + rectS.width * 0.5) - svgRect.left;
        const y2_Anim = (rectS.bottom) - svgRect.top;
        
        const ctrlX_Anim = x1_Anim - (x1_Anim - x2_Anim) * 0.2;
        const ctrlY_Anim = y2_Anim + 30;
        
        lineAnim.setAttribute('d', `M ${x1_Anim} ${y1_Anim} Q ${ctrlX_Anim} ${ctrlY_Anim} ${x2_Anim} ${y2_Anim}`);
    }
    
    // Listen to changes
    window.addEventListener('load', () => {
        updatePointerLines();
        setTimeout(updatePointerLines, 200); // Extra tick for layout settling
    });
    window.addEventListener('resize', updatePointerLines);
    window.addEventListener('scroll', updatePointerLines);

    /* --------------------------------------------------------------------------
       5. FLOWING BINARY WAVING TEXT
       -------------------------------------------------------------------------- */
    const binaryTextPath = document.getElementById('binaryTextPath');
    let binaryOffset = 0;
    
    function animateBinary() {
        if (binaryTextPath) {
            binaryOffset = (binaryOffset - 0.08) % 100;
            binaryTextPath.setAttribute('startOffset', `${binaryOffset}%`);
        }
        requestAnimationFrame(animateBinary);
    }
    animateBinary();

    /* --------------------------------------------------------------------------
       6. MOBILE DRAWER NAV
       -------------------------------------------------------------------------- */
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    
    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileNav.classList.toggle('open');
            mobileMenuBtn.innerHTML = mobileNav.classList.contains('open') ? 
                '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
        });
        
        document.addEventListener('click', () => {
            mobileNav.classList.remove('open');
            mobileMenuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
        });
        
        mobileNav.addEventListener('click', (e) => e.stopPropagation());
    }

    /* --------------------------------------------------------------------------
       7. BENTO CARD VFS FILE MANAGER PREVIEW
       -------------------------------------------------------------------------- */
    const bentoVfsItems = document.querySelectorAll('.vfs-contents .vfs-item');
    bentoVfsItems.forEach(item => {
        item.addEventListener('click', () => {
            const name = item.querySelector('span').innerText;
            const type = item.dataset.type;
            alert(`Virtual File System (VFS):\nName: ${name}\nType: ${type}\nLocation: /root/`);
        });
    });

    /* --------------------------------------------------------------------------
       8. OS SIMULATOR WINDOW MANAGER (SANDBOX DEKSTOP)
       -------------------------------------------------------------------------- */
    const desktop = document.getElementById('osDesktop');
    const windows = document.querySelectorAll('.os-window');
    const desktopIcons = document.querySelectorAll('.desktop-icon');
    const taskbarApps = document.getElementById('taskbarApps');
    const startBtn = document.getElementById('osStartBtn');
    const startMenu = document.getElementById('desktopStartMenu');
    
    let activeAppZIndex = 20;

    // Double-click desktop icons to open app
    desktopIcons.forEach(icon => {
        icon.addEventListener('dblclick', () => {
            const appName = icon.dataset.app;
            openAppWindow(appName);
        });
        
        // Single tap / click selection visual
        icon.addEventListener('click', (e) => {
            e.stopPropagation();
            desktopIcons.forEach(i => i.classList.remove('active-icon'));
            icon.classList.add('active-icon');
        });
    });

    // Clear desktop selections on desktop click
    if (desktop) {
        desktop.addEventListener('click', () => {
            desktopIcons.forEach(i => i.classList.remove('active-icon'));
            if (startMenu) startMenu.classList.remove('open');
        });
    }

    // Toggle Start Menu
    if (startBtn && startMenu) {
        startBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            startMenu.classList.toggle('open');
        });
        
        startMenu.addEventListener('click', (e) => e.stopPropagation());
    }
    
    // Start menu item clicks
    const startItems = document.querySelectorAll('.start-item');
    startItems.forEach(item => {
        item.addEventListener('click', () => {
            const app = item.dataset.app;
            openAppWindow(app);
            if (startMenu) startMenu.classList.remove('open');
        });
    });
    
    // Shutdown system action
    const btnShutdown = document.getElementById('btnShutdown');
    const shutdownOverlay = document.getElementById('desktopShutdownOverlay');
    const btnRestartOS = document.getElementById('btnRestartOS');
    
    if (btnShutdown && shutdownOverlay) {
        btnShutdown.addEventListener('click', () => {
            shutdownOverlay.style.display = 'flex';
            if (startMenu) startMenu.classList.remove('open');
            // Close all windows programmatically
            windows.forEach(win => win.style.display = 'none');
            if (taskbarApps) taskbarApps.innerHTML = '';
        });
    }
    
    if (btnRestartOS && shutdownOverlay) {
        btnRestartOS.addEventListener('click', () => {
            shutdownOverlay.style.display = 'none';
            // Play boot sound
            playBeep(220, 0.1);
            setTimeout(() => playBeep(440, 0.15), 100);
            setTimeout(() => playBeep(880, 0.25), 250);
        });
    }

    function openAppWindow(appName) {
        const win = document.getElementById(`win-${appName}`);
        if (!win) return;
        
        // Show window if hidden
        if (win.style.display === 'none') {
            win.style.display = 'flex';
            win.style.opacity = '0';
            win.style.transform = 'scale(0.95)';
            
            // Centering coordinate helper on launch
            const dWidth = desktop.clientWidth;
            const dHeight = desktop.clientHeight;
            const wWidth = parseInt(win.style.width) || 400;
            const wHeight = parseInt(win.style.height) || 400;
            
            // Push randomly slightly to stagger
            const randomOffset = Math.floor(Math.random() * 40) - 20;
            win.style.left = `${Math.max(20, (dWidth - wWidth) / 2 + randomOffset)}px`;
            win.style.top = `${Math.max(20, (dHeight - wHeight) / 2 + randomOffset)}px`;
            
            setTimeout(() => {
                win.style.opacity = '1';
                win.style.transform = 'scale(1)';
            }, 50);
            
            // Add taskbar icon
            addTaskbarIcon(appName);
        }
        
        focusWindow(win);
    }

    function focusWindow(win) {
        windows.forEach(w => w.classList.remove('active-window'));
        win.classList.add('active-window');
        
        activeAppZIndex += 1;
        win.style.zIndex = activeAppZIndex;
        
        // Sync active state to taskbar icon
        const appName = win.id.replace('win-', '');
        const tbIcons = document.querySelectorAll('.tb-app-icon');
        tbIcons.forEach(icon => {
            if (icon.dataset.app === appName) {
                icon.classList.add('active');
            } else {
                icon.classList.remove('active');
            }
        });
        
        // Auto focus inputs inside focused windows
        const input = win.querySelector('input');
        if (input) input.focus();
    }

    function addTaskbarIcon(appName) {
        // Prevent duplicate icons
        if (taskbarApps.querySelector(`[data-app="${appName}"]`)) return;
        
        const iconBtn = document.createElement('button');
        iconBtn.className = 'tb-app-icon active';
        iconBtn.dataset.app = appName;
        
        let iconClass = 'fa-folder';
        if (appName === 'terminal') iconClass = 'fa-terminal';
        if (appName === 'settings') iconClass = 'fa-gear';
        if (appName === 'snake') iconClass = 'fa-gamepad';
        
        iconBtn.innerHTML = `<i class="fa-solid ${iconClass}"></i>`;
        
        iconBtn.addEventListener('click', () => {
            const win = document.getElementById(`win-${appName}`);
            if (!win) return;
            
            if (win.style.display === 'none') {
                win.style.display = 'flex';
                focusWindow(win);
            } else if (win.classList.contains('active-window')) {
                // Minimize if clicked while active
                win.style.display = 'none';
                iconBtn.classList.remove('active');
            } else {
                // Restore & Focus
                focusWindow(win);
            }
        });
        
        taskbarApps.appendChild(iconBtn);
    }

    function removeTaskbarIcon(appName) {
        const icon = taskbarApps.querySelector(`[data-app="${appName}"]`);
        if (icon) icon.remove();
    }

    // Windows Titlebar Control events (Min, Max, Close)
    const windowControls = document.querySelectorAll('.win-controls .win-btn');
    windowControls.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const app = btn.dataset.app;
            const win = document.getElementById(`win-${app}`);
            if (!win) return;
            
            if (btn.classList.contains('btn-close')) {
                // Close
                win.style.display = 'none';
                removeTaskbarIcon(app);
            } else if (btn.classList.contains('btn-min')) {
                // Minimize
                win.style.display = 'none';
                const tbIcon = taskbarApps.querySelector(`[data-app="${app}"]`);
                if (tbIcon) tbIcon.classList.remove('active');
            } else if (btn.classList.contains('btn-max')) {
                // Maximize Toggle
                if (win.classList.contains('maximized')) {
                    win.classList.remove('maximized');
                    win.style.width = win.dataset.preWidth || '500px';
                    win.style.height = win.dataset.preHeight || '400px';
                    win.style.left = win.dataset.preLeft || '10%';
                    win.style.top = win.dataset.preTop || '15%';
                } else {
                    // Save parameters
                    win.dataset.preWidth = win.style.width;
                    win.dataset.preHeight = win.style.height;
                    win.dataset.preLeft = win.style.left;
                    win.dataset.preTop = win.style.top;
                    
                    win.classList.add('maximized');
                    win.style.width = '100%';
                    win.style.height = 'calc(100% - 42px)';
                    win.style.left = '0';
                    win.style.top = '0';
                }
            }
        });
    });

    // Make windows drag-and-drop functional
    windows.forEach(win => {
        const titlebar = win.querySelector('.win-titlebar');
        if (!titlebar) return;
        
        titlebar.addEventListener('mousedown', (e) => {
            if (e.target.closest('.win-controls')) return; // Avoid drag on button clicks
            if (win.classList.contains('maximized')) return;
            
            focusWindow(win);
            
            const startX = e.clientX;
            const startY = e.clientY;
            const winLeft = win.offsetLeft;
            const winTop = win.offsetTop;
            
            function onDrag(dragEvent) {
                const deltaX = dragEvent.clientX - startX;
                const deltaY = dragEvent.clientY - startY;
                
                let newLeft = winLeft + deltaX;
                let newTop = winTop + deltaY;
                
                // Constrain limits within desktop boundaries
                const maxLeft = desktop.clientWidth - win.clientWidth;
                const maxTop = desktop.clientHeight - 42 - win.clientHeight;
                
                newLeft = Math.max(0, Math.min(newLeft, maxLeft));
                newTop = Math.max(0, Math.min(newTop, maxTop));
                
                win.style.left = `${newLeft}px`;
                win.style.top = `${newTop}px`;
            }
            
            function onRelease() {
                document.removeEventListener('mousemove', onDrag);
                document.removeEventListener('mouseup', onRelease);
            }
            
            document.addEventListener('mousemove', onDrag);
            document.addEventListener('mouseup', onRelease);
        });
        
        // Focus window on direct click
        win.addEventListener('mousedown', () => focusWindow(win));
    });

    // Keep System Clock Updated in Taskbar
    function updateClock() {
        const timeWidget = document.getElementById('desktopTime');
        if (timeWidget) {
            const now = new Date();
            let hours = now.getHours();
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // 0 should be 12
            timeWidget.innerText = `${hours}:${minutes} ${ampm}`;
        }
    }
    setInterval(updateClock, 1000);
    updateClock();

    /* --------------------------------------------------------------------------
       9. FILE EXPLORER APP (VIRTUAL FILE SYSTEM)
       -------------------------------------------------------------------------- */
    const mockVFS = {
        '/root': {
            dirs: ['system', 'apps', 'user'],
            files: {
                'boot.log': 'SYSTEM COMPILING STATUS...\n[OK] Mount VFS driver\n[OK] Setup double-buffer drawing context\n[OK] Sound hardware sync complete\n[OK] Loaded Pure OS user sandbox shell successfully.',
                'readme.txt': 'Welcome to the Pure OS sandbox GUI!\n\nThis application simulates the custom graphical user interface design of Pure OS. Double-click desktop items to toggle apps, drag windows, or run terminal queries.'
            }
        },
        '/root/system': {
            dirs: ['drivers'],
            files: {
                'kernel.bin': '[BINARY RESOURCE] Core kernel executable size: 2.44 MB',
                'scheduler.sys': 'Scheduler: Round-robin task manager loaded.'
            }
        },
        '/root/system/drivers': {
            dirs: [],
            files: {
                'mouse.sys': 'Mouse input translation driver configured.',
                'display.sys': 'VGA graphics display driver operating on frame buffer.'
            }
        },
        '/root/apps': {
            dirs: [],
            files: {
                'snake.exe': '[EXECUTABLE] Retro Snake video game launcher.',
                'terminal.exe': '[EXECUTABLE] Command Terminal execution script.'
            }
        },
        '/root/user': {
            dirs: ['images'],
            files: {
                'welcome.txt': 'Hello User! This is your custom file environment. Feel free to explore details or start games.',
                'pureos.nfo': 'PURE OS VERSION DETAILS:\nCompiled: 2026\nKernel Architecture: x86_64 Core\nDevelopment team: Pure Systems'
            }
        },
        '/root/user/images': {
            dirs: [],
            files: {
                'desk_wallpaper.png': '[IMAGE] Background asset preview.'
            }
        }
    };
    
    let currentVFSPath = '/root';
    const feContentArea = document.getElementById('fe-content-area');
    const fePathBar = document.getElementById('fe-path-bar');
    const feBackBtn = document.getElementById('fe-back-btn');
    const feSidebarFolders = document.querySelectorAll('.sidebar-folder');
    
    function renderVFS() {
        if (!feContentArea) return;
        feContentArea.innerHTML = '';
        
        const pathData = mockVFS[currentVFSPath];
        if (!pathData) return;
        
        fePathBar.innerText = currentVFSPath;
        
        // Back button status
        feBackBtn.disabled = currentVFSPath === '/root';
        
        // Render directories
        pathData.dirs.forEach(dir => {
            const item = document.createElement('div');
            item.className = 'fe-item';
            item.innerHTML = `
                <div class="fe-item-icon"><i class="fa-solid fa-folder text-accent"></i></div>
                <div class="fe-item-name">${dir}</div>
            `;
            item.addEventListener('dblclick', () => {
                currentVFSPath = currentVFSPath === '/' ? `/${dir}` : `${currentVFSPath}/${dir}`;
                renderVFS();
            });
            feContentArea.appendChild(item);
        });
        
        // Render files
        Object.keys(pathData.files).forEach(file => {
            const item = document.createElement('div');
            item.className = 'fe-item';
            
            let iconClass = 'fa-file-lines text-muted';
            if (file.endsWith('.log')) iconClass = 'fa-file-medical text-highlight';
            if (file.endsWith('.sys')) iconClass = 'fa-file-shield text-lime';
            if (file.endsWith('.exe')) iconClass = 'fa-file-code text-purple';
            
            item.innerHTML = `
                <div class="fe-item-icon"><i class="fa-regular ${iconClass}"></i></div>
                <div class="fe-item-name">${file}</div>
            `;
            
            item.addEventListener('dblclick', () => {
                openFileViewer(file, pathData.files[file]);
            });
            feContentArea.appendChild(item);
        });
        
        // Update items count in statusbar
        const totalItems = pathData.dirs.length + Object.keys(pathData.files).length;
        document.getElementById('fe-status-items').innerText = `${totalItems} Items`;
    }
    
    function openFileViewer(filename, content) {
        const explorer = document.getElementById('win-file-explorer');
        if (!explorer) return;
        
        // Create viewer container inside file explorer
        let viewer = explorer.querySelector('.file-text-viewer');
        if (!viewer) {
            viewer = document.createElement('div');
            viewer.className = 'file-text-viewer';
            explorer.appendChild(viewer);
        }
        
        viewer.innerHTML = `
            <div class="viewer-header">
                <span><i class="fa-solid fa-file-lines"></i> ${filename}</span>
                <button class="viewer-close-btn" style="font-size: 14px;"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div class="viewer-body">${content.replace(/\n/g, '<br>')}</div>
        `;
        
        viewer.querySelector('.viewer-close-btn').addEventListener('click', () => {
            viewer.remove();
        });
    }

    if (feBackBtn) {
        feBackBtn.addEventListener('click', () => {
            if (currentVFSPath === '/root') return;
            const segments = currentVFSPath.split('/');
            segments.pop();
            currentVFSPath = segments.join('/');
            renderVFS();
            
            // Sync active sidebar highlighting
            feSidebarFolders.forEach(sf => {
                if (sf.dataset.path === currentVFSPath) {
                    feSidebarFolders.forEach(x => x.classList.remove('active'));
                    sf.classList.add('active');
                }
            });
        });
    }

    feSidebarFolders.forEach(folder => {
        folder.addEventListener('click', () => {
            feSidebarFolders.forEach(f => f.classList.remove('active'));
            folder.classList.add('active');
            
            currentVFSPath = folder.dataset.path;
            renderVFS();
        });
    });
    
    // Initial VFS rendering
    renderVFS();

    /* --------------------------------------------------------------------------
       10. TERMINAL CONSOLE COMMAND ENGINE
       -------------------------------------------------------------------------- */
    const terminalHistory = document.getElementById('terminalHistory');
    const terminalInput = document.getElementById('terminalInput');
    const terminalScroll = document.getElementById('terminal-scroll-area');
    
    let terminalCurrentDir = '/root';
    
    if (terminalInput) {
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const commandLine = terminalInput.value.trim();
                terminalInput.value = '';
                
                if (commandLine) {
                    processTerminalCommand(commandLine);
                }
            }
        });
    }
    
    function logTerminal(promptText, text, isError = false) {
        const line = document.createElement('div');
        line.className = 'term-line-out';
        if (promptText) {
            line.innerHTML = `<span class="term-prompt">${promptText}</span> ${text}`;
        } else {
            line.innerHTML = text;
        }
        if (isError) line.style.color = 'var(--color-highlight)';
        
        terminalHistory.appendChild(line);
        if (terminalScroll) {
            terminalScroll.scrollTop = terminalScroll.scrollHeight;
        }
    }

    function processTerminalCommand(cmdText) {
        // Output typed line first
        logTerminal('pureos@system:~$', cmdText);
        
        const args = cmdText.split(' ');
        const baseCmd = args[0].toLowerCase();
        
        switch (baseCmd) {
            case 'help':
                logTerminal('', 'Available PureOS commands:<br>' +
                    '  help             - View terminal commands list<br>' +
                    '  neofetch         - Print shell specs & ASCII graphic<br>' +
                    '  ls               - List directories & files in current VFS<br>' +
                    '  cat [filename]   - Print file contents<br>' +
                    '  cd [path]        - Navigate system (e.g. cd system)<br>' +
                    '  clear            - Wipe command logs screen<br>' +
                    '  snake            - Run Snake canvas application<br>' +
                    '  matrix           - Boot Digital Matrix rain effect<br>' +
                    '  beep [hz] [sec]  - Trigger beep sound (e.g. beep 440 0.5)'
                );
                break;
                
            case 'neofetch':
                logTerminal('', `
<div class="terminal-neofetch" style="color:#22c55e;">
  <div class="logo-ascii" style="color:var(--color-accent);">
   ██████  ██    ██ 
   ██   ██ ██    ██ 
   ██████  ██    ██ 
   ██      ██    ██ 
   ██       ██████  
  </div>
  <div class="sys-info">
    <span class="info-label" style="color:var(--color-highlight);">OS:</span> Pure OS 64-bit sandbox<br>
    <span class="info-label" style="color:var(--color-highlight);">Kernel:</span> PureKern v1.0.4<br>
    <span class="info-label" style="color:var(--color-highlight);">UI Engine:</span> Canvas Double-Buffer<br>
    <span class="info-label" style="color:var(--color-highlight);">Compile Env:</span> GCC 13.2.0<br>
    <span class="info-label" style="color:var(--color-highlight);">Resolution:</span> Dynamic Viewport scale<br>
    <span class="info-label" style="color:var(--color-highlight);">Theme:</span> Accent-${body.classList.toString().includes('accent-') ? body.classList.toString().match(/accent-\w+/)[0].split('-')[1] : 'blue'}
  </div>
</div>`);
                break;
                
            case 'clear':
                terminalHistory.innerHTML = '';
                break;
                
            case 'ls':
                const pathData = mockVFS[terminalCurrentDir];
                if (pathData) {
                    let dirsString = pathData.dirs.map(d => `<span style="color:var(--color-accent); font-weight:bold;">${d}/</span>`).join('  ');
                    let filesString = Object.keys(pathData.files).map(f => `<span style="color:#ffffff;">${f}</span>`).join('  ');
                    logTerminal('', `${dirsString}  ${filesString}`.trim() || '[empty directory]');
                }
                break;
                
            case 'cd':
                const targetDir = args[1];
                if (!targetDir || targetDir === '~') {
                    terminalCurrentDir = '/root';
                    logTerminal('', 'Navigated to /root');
                } else if (targetDir === '..') {
                    if (terminalCurrentDir !== '/root') {
                        const segments = terminalCurrentDir.split('/');
                        segments.pop();
                        terminalCurrentDir = segments.join('/');
                        logTerminal('', `Navigated to ${terminalCurrentDir}`);
                    }
                } else {
                    const currentData = mockVFS[terminalCurrentDir];
                    if (currentData && currentData.dirs.includes(targetDir)) {
                        terminalCurrentDir = `${terminalCurrentDir}/${targetDir}`;
                        logTerminal('', `Navigated to ${terminalCurrentDir}`);
                    } else {
                        logTerminal('', `Error: directory '${targetDir}' not found in current folder.`, true);
                    }
                }
                break;
                
            case 'cat':
                const filename = args[1];
                if (!filename) {
                    logTerminal('', 'Usage: cat [filename]', true);
                    break;
                }
                const curPath = mockVFS[terminalCurrentDir];
                if (curPath && curPath.files[filename]) {
                    logTerminal('', curPath.files[filename].replace(/\n/g, '<br>'));
                } else {
                    logTerminal('', `Error: file '${filename}' not found.`, true);
                }
                break;
                
            case 'snake':
                logTerminal('', 'Launching Snake game...');
                openAppWindow('snake');
                break;
                
            case 'matrix':
                logTerminal('', 'Matrix digital sequence initiated...');
                launchMatrixRain();
                break;
                
            case 'beep':
                const hz = parseInt(args[1]) || 440;
                const sec = parseFloat(args[2]) || 0.2;
                playBeep(hz, sec);
                logTerminal('', `Emitted sound beep frequency: ${hz}Hz, duration: ${sec}s`);
                break;
                
            default:
                logTerminal('', `Command not found: '${baseCmd}'. Type 'help' to review shell options.`, true);
        }
    }
    
    // Matrix Falling Digital Rain Terminal Effect
    function launchMatrixRain() {
        const termBody = document.getElementById('terminal-scroll-area');
        if (!termBody) return;
        
        // Create canvas overlay
        const canvas = document.createElement('canvas');
        canvas.style.position = 'absolute';
        canvas.style.top = '38px'; // Shift below titlebar
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = 'calc(100% - 38px)';
        canvas.style.zIndex = '5';
        canvas.style.background = '#000';
        termBody.parentElement.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        let width = canvas.width = canvas.parentElement.clientWidth;
        let height = canvas.height = canvas.parentElement.clientHeight - 38;
        
        // Close button overlay
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = 'Exit Matrix [x]';
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '50px';
        closeBtn.style.right = '20px';
        closeBtn.style.zIndex = '10';
        closeBtn.style.background = 'rgba(255,255,255,0.1)';
        closeBtn.style.border = '1px solid #10b981';
        closeBtn.style.color = '#10b981';
        closeBtn.style.padding = '4px 8px';
        closeBtn.style.fontSize = '10px';
        closeBtn.style.fontFamily = 'JetBrains Mono';
        canvas.parentElement.appendChild(closeBtn);
        
        closeBtn.addEventListener('click', () => {
            canvas.remove();
            closeBtn.remove();
        });
        
        const chars = '01010101ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const fontSize = 13;
        const columns = Math.floor(width / fontSize) + 1;
        const drops = Array(columns).fill(1);
        
        let matrixInterval = setInterval(() => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, width, height);
            
            ctx.fillStyle = '#0f0';
            ctx.font = `${fontSize}px monospace`;
            
            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                const x = i * fontSize;
                const y = drops[i] * fontSize;
                
                ctx.fillText(text, x, y);
                
                if (y > height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }, 33);
        
        // Stop interval when canvas is removed
        const checkExist = setInterval(() => {
            if (!document.body.contains(canvas)) {
                clearInterval(matrixInterval);
                clearInterval(checkExist);
            }
        }, 500);
    }

    /* --------------------------------------------------------------------------
       11. SETTINGS APP (WALLPAPER & INTERACTIVE ADJUSTERS)
       -------------------------------------------------------------------------- */
    const settingsNavItems = document.querySelectorAll('.settings-nav-item');
    const tabPanels = document.querySelectorAll('.settings-tab-panel');
    const wallpaperItems = document.querySelectorAll('.wallpaper-item');
    const accentDots = document.querySelectorAll('.theme-accent-selectors .accent-dot');
    const guiSlider = document.getElementById('guiScaleSlider');
    const guiValText = document.getElementById('guiScaleValue');
    
    settingsNavItems.forEach(item => {
        item.addEventListener('click', () => {
            settingsNavItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            const targetTab = item.dataset.tab;
            tabPanels.forEach(panel => {
                if (panel.id === `tab-${targetTab}`) {
                    panel.style.display = 'block';
                } else {
                    panel.style.display = 'none';
                }
            });
        });
    });
    
    // Changing wallpapers
    wallpaperItems.forEach(item => {
        item.addEventListener('click', () => {
            wallpaperItems.forEach(wp => wp.classList.remove('active'));
            item.classList.add('active');
            
            const wpName = item.dataset.wp;
            if (wpName === 'dark-grid') {
                desktop.style.background = 'radial-gradient(circle, #1e293b, #0f172a)';
            } else if (wpName === 'matrix') {
                desktop.style.background = '#052e16';
            } else if (wpName === 'sunset') {
                desktop.style.background = 'linear-gradient(135deg, #f43f5e, #fb923c)';
            } else if (wpName === 'pure-brutal') {
                desktop.style.background = '#e2f952';
            }
        });
    });
    
    // Change Accent Theme color
    accentDots.forEach(dot => {
        dot.addEventListener('click', () => {
            accentDots.forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
            
            const accent = dot.dataset.accent;
            body.classList.remove('accent-pink', 'accent-lime', 'accent-purple');
            if (accent !== 'blue') {
                body.classList.add(`accent-${accent}`);
            }
            
            // Sync with bento picker active dot
            const bentoPickerDots = document.querySelectorAll('.theme-picker-bento .color-dot');
            bentoPickerDots.forEach(bd => {
                if (bd.dataset.color === accent) {
                    bentoPickerDots.forEach(x => x.classList.remove('active'));
                    bd.classList.add('active');
                }
            });
        });
    });
    
    // Desktop GUI Scaling Adjuster slider
    if (guiSlider && guiValText) {
        guiSlider.addEventListener('input', () => {
            const val = guiSlider.value;
            guiValText.innerText = `${val}x`;
            document.documentElement.style.setProperty('--os-gui-scale', val);
            
            // Sync back to bento scales
            const bentoScales = document.querySelectorAll('.scale-btn');
            bentoScales.forEach(btn => {
                if (btn.dataset.scale === val) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            setTimeout(updatePointerLines, 100);
        });
    }

    /* --------------------------------------------------------------------------
       12. RETRO SNAKE APP (CANVAS DRIVEN GAME IN SIMULATOR)
       -------------------------------------------------------------------------- */
    const snakeCanvas = document.getElementById('snakeCanvas');
    const snakeScoreText = document.getElementById('snakeScore');
    const snakeHighScoreText = document.getElementById('snakeHighScore');
    const btnStartSnake = document.getElementById('btnStartSnake');
    
    let snakeCtx = snakeCanvas ? snakeCanvas.getContext('2d') : null;
    let snakeGameInterval = null;
    let snakeScore = 0;
    let snakeHighScore = 0;
    
    const snakeGrid = 16;
    let snake = {
        x: 160,
        y: 160,
        dx: snakeGrid,
        dy: 0,
        cells: [],
        maxCells: 4
    };
    
    let snakeFood = {
        x: 96,
        y: 96
    };
    
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    
    function resetSnakeGame() {
        snakeScore = 0;
        snakeScoreText.innerText = '000';
        
        snake.x = 160;
        snake.y = 160;
        snake.cells = [];
        snake.maxCells = 4;
        snake.dx = snakeGrid;
        snake.dy = 0;
        
        generateFood();
    }
    
    function generateFood() {
        snakeFood.x = getRandomInt(0, 22) * snakeGrid;
        snakeFood.y = getRandomInt(0, 20) * snakeGrid;
    }
    
    function updateSnakeFrame() {
        if (!snakeCtx) return;
        
        // Move snake
        snake.x += snake.dx;
        snake.y += snake.dy;
        
        // Wrap edge boundaries
        if (snake.x < 0) snake.x = snakeCanvas.width - snakeGrid;
        else if (snake.x >= snakeCanvas.width) snake.x = 0;
        
        if (snake.y < 0) snake.y = snakeCanvas.height - snakeGrid;
        else if (snake.y >= snakeCanvas.height) snake.y = 0;
        
        // Keep track of movement tail
        snake.cells.unshift({x: snake.x, y: snake.y});
        
        if (snake.cells.length > snake.maxCells) {
            snake.cells.pop();
        }
        
        // Clear canvas
        snakeCtx.fillStyle = '#020617';
        snakeCtx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);
        
        // Draw food
        snakeCtx.fillStyle = '#f43f5e';
        snakeCtx.fillRect(snakeFood.x, snakeFood.y, snakeGrid - 1, snakeGrid - 1);
        
        // Draw snake
        snakeCtx.fillStyle = '#10b981';
        snake.cells.forEach((cell, index) => {
            // Draw head slightly different green
            if (index === 0) snakeCtx.fillStyle = '#34d399';
            else snakeCtx.fillStyle = '#10b981';
            
            snakeCtx.fillRect(cell.x, cell.y, snakeGrid - 1, snakeGrid - 1);
            
            // Check food eating
            if (cell.x === snakeFood.x && cell.y === snakeFood.y) {
                snake.maxCells++;
                snakeScore += 10;
                snakeScoreText.innerText = snakeScore.toString().padStart(3, '0');
                playBeep(600, 0.05);
                generateFood();
            }
            
            // Collision detection with tail
            for (let i = index + 1; i < snake.cells.length; i++) {
                if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                    // Game Over
                    playBeep(150, 0.4);
                    stopSnakeGame();
                    alert(`GAME OVER! Final Score: ${snakeScore}`);
                    if (snakeScore > snakeHighScore) {
                        snakeHighScore = snakeScore;
                        snakeHighScoreText.innerText = snakeHighScore.toString().padStart(3, '0');
                    }
                    resetSnakeGame();
                }
            }
        });
    }
    
    function startSnakeGame() {
        if (snakeGameInterval) clearInterval(snakeGameInterval);
        resetSnakeGame();
        snakeGameInterval = setInterval(updateSnakeFrame, 90);
    }
    
    function stopSnakeGame() {
        if (snakeGameInterval) {
            clearInterval(snakeGameInterval);
            snakeGameInterval = null;
        }
    }
    
    if (btnStartSnake) {
        btnStartSnake.addEventListener('click', () => {
            startSnakeGame();
            // Refocus canvas
            snakeCanvas.focus();
        });
    }
    
    // Keyboard inputs listener for snake direction (only when snake window has focus)
    window.addEventListener('keydown', (e) => {
        const snakeWindow = document.getElementById('win-snake');
        if (!snakeWindow || snakeWindow.style.display === 'none' || !snakeWindow.classList.contains('active-window')) {
            return;
        }
        
        // Block arrows default page scrolling if snake is running
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
        }
        
        // Prevent 180 degree turns
        if (e.key === 'ArrowLeft' && snake.dx === 0) {
            snake.dx = -snakeGrid;
            snake.dy = 0;
        } else if (e.key === 'ArrowUp' && snake.dy === 0) {
            snake.dy = -snakeGrid;
            snake.dx = 0;
        } else if (e.key === 'ArrowRight' && snake.dx === 0) {
            snake.dx = snakeGrid;
            snake.dy = 0;
        } else if (e.key === 'ArrowDown' && snake.dy === 0) {
            snake.dy = snakeGrid;
            snake.dx = 0;
        }
    });
    
    // Stop game cycle if window closed
    const snakeCloseBtn = document.querySelector('#win-snake .btn-close');
    if (snakeCloseBtn) {
        snakeCloseBtn.addEventListener('click', stopSnakeGame);
    }

    /* --------------------------------------------------------------------------
       13. SYNTHESIZED OS SOUND ENGINE (WEB AUDIO API)
       -------------------------------------------------------------------------- */
    let audioCtx = null;
    
    function playBeep(frequency = 440, duration = 0.1) {
        try {
            // Lazy load audio context since browsers restrict audio before click
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.frequency.value = frequency;
            osc.type = 'triangle'; // Smoother tone
            
            gain.gain.setValueAtTime(0.08, audioCtx.currentTime); // Keep volume soft
            gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
            
            osc.start(audioCtx.currentTime);
            osc.stop(audioCtx.currentTime + duration);
        } catch (err) {
            // Audio context not supported or blocked
            console.log('Audio playback ignored due to browser policy or support');
        }
    }

    /* --------------------------------------------------------------------------
       14. KERNEL SPEC LAYER HOVER SELECTOR
       -------------------------------------------------------------------------- */
    const kernelLayers = document.querySelectorAll('.kernel-layer');
    const kDefaultInfo = document.querySelector('.info-default');
    const kContentInfo = document.getElementById('kernelInfoContent');
    const badge = document.getElementById('infoLayerBadge');
    const title = document.getElementById('infoLayerTitle');
    const desc = document.getElementById('infoLayerDesc');
    const list = document.getElementById('infoLayerList');
    
    const layerDatabase = {
        'user': {
            badge: 'Layer 01',
            title: 'User Space Applications',
            desc: 'The topmost layer containing GUI environments, custom software apps, compiler shells, games, and user-initiated executables. Restricted access ring prevents direct hardware alterations.',
            elements: [
                'Window Manager & Double-buffered Framebuffer UI',
                'Interactive Terminal Shell (PureSH)',
                'User space application code sandbox environment'
            ]
        },
        'syscall': {
            badge: 'Layer 02',
            title: 'System Call Interface (SCI)',
            desc: 'The translation boundary layer directing requests from User Space into the Kernel Core. Provides secure API entry points for read/write file triggers, memory claims, and process spawns.',
            elements: [
                'VFS file operations handlers (sys_open, sys_read)',
                'CPU Task schedulers and process fork calls',
                'Interrupt-driven API gateway vectors'
            ]
        },
        'core': {
            badge: 'Layer 03',
            title: 'PureKern Microkernel Core',
            desc: 'The heart of Pure OS. Manages process priority states, context-switching schedules, virtual memory paging maps, inter-process communication (IPC) lines, and lock mutex sync loops.',
            elements: [
                'Round-robin priority task scheduler',
                'CPU Interrupt controller queues',
                'Virtual Memory Page Allocator (PMM/VMM)'
            ]
        },
        'drivers': {
            badge: 'Layer 04',
            title: 'Device Driver Module Layer',
            desc: 'Low-level device drivers that convert abstract operations into signals recognized by physical chips. Dynamically loaded to handle graphics drawing, inputs, storage, and audio.',
            elements: [
                'VESA/GOP Framebuffer display driver',
                'PS2 Keyboard & Mouse translator drivers',
                'FAT32/Ext2 storage partition drivers'
            ]
        },
        'hardware': {
            badge: 'Layer 05',
            title: 'Hardware Abstraction Layer (HAL)',
            desc: 'The absolute bottom-most code segment interfacing directly with physical x86_64 silicon chips, motherboard buses, memory modules, registers, and timing oscillators.',
            elements: [
                'CPU GDT, IDT registers and page tables setup',
                'PCI Bus controllers scan loops',
                'PIT/APIC hardware timing clock drivers'
            ]
        }
    };
    
    kernelLayers.forEach(layer => {
        layer.addEventListener('mouseenter', () => {
            const layerKey = layer.dataset.layer;
            const data = layerDatabase[layerKey];
            if (!data) return;
            
            // Focus style
            kernelLayers.forEach(l => l.classList.remove('active'));
            layer.classList.add('active');
            
            // Update info display
            if (kDefaultInfo) kDefaultInfo.style.display = 'none';
            if (kContentInfo) {
                kContentInfo.style.display = 'block';
                badge.innerText = data.badge;
                title.innerText = data.title;
                desc.innerText = data.desc;
                
                list.innerHTML = '';
                data.elements.forEach(el => {
                    const li = document.createElement('li');
                    li.innerText = el;
                    list.appendChild(li);
                });
            }
        });
    });

    /* --------------------------------------------------------------------------
       15. GALLERY SLIDER CAROUSEL
       -------------------------------------------------------------------------- */
    const track = document.getElementById('carouselTrack');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.getElementById('carouselPrevBtn');
    const nextBtn = document.getElementById('carouselNextBtn');
    const dotsContainer = document.getElementById('carouselDots');
    
    let currentSlide = 0;
    
    if (track && slides.length > 0) {
        // Build dots indicators
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            slides.forEach((_, idx) => {
                const dot = document.createElement('button');
                dot.className = idx === 0 ? 'dot active' : 'dot';
                dot.dataset.slide = idx;
                dot.addEventListener('click', () => goToSlide(idx));
                dotsContainer.appendChild(dot);
            });
        }
        
        function updateCarousel() {
            track.style.transform = `translateX(-${currentSlide * 100}%)`;
            
            // Sync dots
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, idx) => {
                if (idx === currentSlide) dot.classList.add('active');
                else dot.classList.remove('active');
            });
        }
        
        function goToSlide(index) {
            currentSlide = index;
            updateCarousel();
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentSlide = (currentSlide - 1 + slides.length) % slides.length;
                updateCarousel();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentSlide = (currentSlide + 1) % slides.length;
                updateCarousel();
            });
        }
        
        // Auto-run slide changes
        let autoSlideTimer = setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            updateCarousel();
        }, 8000);
        
        // Pause timer on hover
        const carousel = document.querySelector('.carousel-container');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => clearInterval(autoSlideTimer));
            carousel.addEventListener('mouseleave', () => {
                autoSlideTimer = setInterval(() => {
                    currentSlide = (currentSlide + 1) % slides.length;
                    updateCarousel();
                }, 8000);
            });
        }
    }

    /* --------------------------------------------------------------------------
       16. ABOUT NEWSLETTER SUBMIT FORM FEEDBACK
       -------------------------------------------------------------------------- */
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterFeedback = document.getElementById('newsletterFeedback');
    
    if (newsletterForm && newsletterFeedback) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('emailInput');
            const email = emailInput ? emailInput.value.trim() : '';
            
            if (email) {
                // Play notification success sound
                playBeep(880, 0.08);
                setTimeout(() => playBeep(1100, 0.12), 80);
                
                newsletterFeedback.className = 'form-feedback success';
                newsletterFeedback.innerHTML = '<i class="fa-solid fa-circle-check"></i> Subscribed successfully! Welcome to Pure OS development logs.';
                if (emailInput) emailInput.value = '';
                
                setTimeout(() => {
                    newsletterFeedback.innerHTML = '';
                    newsletterFeedback.className = 'form-feedback';
                }, 6000);
            }
        });
    }

    /* --------------------------------------------------------------------------
       17. NAV LINK ACTIVE SCROLL SYNC
       -------------------------------------------------------------------------- */
    const sections = document.querySelectorAll('main > section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let currentSectionId = 'home';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100; // Account for navbar offset height
            if (window.scrollY >= sectionTop) {
                currentSectionId = section.id;
            }
        });
        
        navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    });

});

/* ==========================================================================
   GSAP + SCROLLTRIGGER ANIMATION SYSTEM
   ========================================================================== */

// Wait for GSAP to be available
window.addEventListener('load', () => {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP or ScrollTrigger not loaded. Skipping animations.');
        return;
    }
    
    gsap.registerPlugin(ScrollTrigger);
    
    /* --------------------------------------------------------------------------
       A. HERO ENTRANCE SEQUENCE
       -------------------------------------------------------------------------- */
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    // Stagger each letter of PURE OS — only opacity + y, then clearProps to avoid conflict with letter magnet
    heroTl.from('.letter-interactive', {
        y: 60,
        opacity: 0,
        stagger: 0.08,
        duration: 0.8,
        clearProps: 'transform'
    })
    .from('.cursor-blink', {
        opacity: 0,
        duration: 0.3,
        clearProps: 'opacity'
    }, '-=0.3')
    .from('.hero-subtitle', {
        y: 30,
        opacity: 0,
        duration: 0.7,
        clearProps: 'all'
    }, '-=0.4')
    .from('.hero-btns a', {
        y: 25,
        opacity: 0,
        stagger: 0.15,
        duration: 0.6,
        clearProps: 'all'
    }, '-=0.3')
    .from('.callout-card', {
        y: 40,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: 'back.out(1.7)',
        clearProps: 'transform,opacity'
    }, '-=0.5')
    .from('.binary-stream-container', {
        x: -80,
        opacity: 0,
        duration: 1,
        clearProps: 'all'
    }, '-=0.6')
    .from('.bottom-right-tag', {
        x: 40,
        opacity: 0,
        duration: 0.6,
        clearProps: 'all'
    }, '-=0.8')
    .from('.scroll-indicator', {
        y: 20,
        opacity: 0,
        duration: 0.5,
        clearProps: 'all'
    }, '-=0.3');
    
    /* --------------------------------------------------------------------------
       B. PARALLAX ON HERO GLOW ORBS
       -------------------------------------------------------------------------- */
    gsap.to('.orb-1', {
        y: -80,
        scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5
        }
    });
    
    gsap.to('.orb-2', {
        y: -120,
        x: -40,
        scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: 'bottom top',
            scrub: 2
        }
    });
    
    /* --------------------------------------------------------------------------
       C. NAVBAR SHRINK ON SCROLL
       -------------------------------------------------------------------------- */
    ScrollTrigger.create({
        start: 'top -80',
        onUpdate: (self) => {
            const navbar = document.querySelector('.navbar');
            if (!navbar) return;
            if (self.direction === 1 && self.scroll() > 80) {
                navbar.style.height = '56px';
                navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
            } else if (self.scroll() <= 80) {
                navbar.style.height = '70px';
                navbar.style.boxShadow = 'none';
            }
        }
    });
    
    /* --------------------------------------------------------------------------
       D. FEATURES SECTION — Section Header + Bento Cards Stagger
       -------------------------------------------------------------------------- */
    // Section header reveal
    gsap.from('#features .section-header .badge-wrapper', {
        scale: 0,
        rotation: -180,
        opacity: 0,
        duration: 0.8,
        ease: 'back.out(2)',
        scrollTrigger: {
            trigger: '#features .section-header',
            start: 'top 80%',
            toggleActions: 'play none none none'
        }
    });
    
    gsap.from('#features .section-title', {
        y: 50,
        opacity: 0,
        duration: 0.7,
        scrollTrigger: {
            trigger: '#features .section-header',
            start: 'top 80%',
            toggleActions: 'play none none none'
        }
    });
    
    gsap.from('#features .section-subtitle', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        delay: 0.2,
        scrollTrigger: {
            trigger: '#features .section-header',
            start: 'top 80%',
            toggleActions: 'play none none none'
        }
    });
    
    // Bento cards stagger from different directions
    const bentoCards = document.querySelectorAll('.bento-card');
    bentoCards.forEach((card, i) => {
        const fromX = i % 2 === 0 ? -50 : 50;
        gsap.from(card, {
            x: fromX,
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    });
    
    // 3D tilt micro-interaction on bento cards
    bentoCards.forEach(card => {
        card.classList.add('tilt-card');
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;
            
            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
    
    /* --------------------------------------------------------------------------
       E. LIVE OS SIMULATOR — Desktop Scale-in
       -------------------------------------------------------------------------- */
    gsap.from('#live-os .section-title', {
        y: 50,
        opacity: 0,
        duration: 0.7,
        scrollTrigger: {
            trigger: '#live-os',
            start: 'top 80%',
            toggleActions: 'play none none none'
        }
    });
    
    gsap.from('#live-os .section-subtitle', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        delay: 0.15,
        scrollTrigger: {
            trigger: '#live-os',
            start: 'top 80%',
            toggleActions: 'play none none none'
        }
    });
    
    gsap.from('.desktop-container', {
        scale: 0.85,
        opacity: 0,
        y: 60,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.desktop-container',
            start: 'top 85%',
            toggleActions: 'play none none none'
        }
    });
    
    /* --------------------------------------------------------------------------
       F. KERNEL SECTION — Layers Cascade In
       -------------------------------------------------------------------------- */
    gsap.from('#kernel .section-title', {
        y: 50,
        opacity: 0,
        duration: 0.7,
        scrollTrigger: {
            trigger: '#kernel',
            start: 'top 80%',
            toggleActions: 'play none none none'
        }
    });
    
    gsap.from('#kernel .section-subtitle', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        delay: 0.15,
        scrollTrigger: {
            trigger: '#kernel',
            start: 'top 80%',
            toggleActions: 'play none none none'
        }
    });
    
    // Kernel layers cascade with left slide
    const kernelLayers = document.querySelectorAll('.kernel-layer');
    kernelLayers.forEach((layer, i) => {
        gsap.from(layer, {
            x: -80,
            opacity: 0,
            duration: 0.6,
            delay: i * 0.12,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.kernel-diagram',
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });
    });
    
    // Info panel slides in from right
    gsap.from('.kernel-info-panel', {
        x: 80,
        opacity: 0,
        duration: 0.8,
        delay: 0.5,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.kernel-container',
            start: 'top 75%',
            toggleActions: 'play none none none'
        }
    });
    
    /* --------------------------------------------------------------------------
       G. GALLERY — Carousel Reveal
       -------------------------------------------------------------------------- */
    gsap.from('#gallery .section-title', {
        y: 50,
        opacity: 0,
        duration: 0.7,
        scrollTrigger: {
            trigger: '#gallery',
            start: 'top 80%',
            toggleActions: 'play none none none'
        }
    });
    
    gsap.from('.carousel-container', {
        y: 60,
        opacity: 0,
        scale: 0.95,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.carousel-container',
            start: 'top 85%',
            toggleActions: 'play none none none'
        }
    });
    
    /* --------------------------------------------------------------------------
       H. ABOUT SECTION — Split Reveal
       -------------------------------------------------------------------------- */
    gsap.from('.about-details', {
        x: -60,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.about-grid',
            start: 'top 80%',
            toggleActions: 'play none none none'
        }
    });
    
    gsap.from('.about-contact-card', {
        x: 60,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        delay: 0.2,
        scrollTrigger: {
            trigger: '.about-grid',
            start: 'top 80%',
            toggleActions: 'play none none none'
        }
    });
    
    // Stat boxes counter-style pop
    const statBoxes = document.querySelectorAll('.stat-box');
    statBoxes.forEach((box, i) => {
        gsap.from(box, {
            y: 40,
            opacity: 0,
            scale: 0.8,
            duration: 0.5,
            delay: 0.3 + (i * 0.12),
            ease: 'back.out(1.5)',
            scrollTrigger: {
                trigger: '.stat-boxes',
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    });
    
    /* --------------------------------------------------------------------------
       I. FOOTER — Fade Up Columns
       -------------------------------------------------------------------------- */
    const footerCols = document.querySelectorAll('.links-col');
    footerCols.forEach((col, i) => {
        gsap.from(col, {
            y: 30,
            opacity: 0,
            duration: 0.5,
            delay: i * 0.1,
            scrollTrigger: {
                trigger: '.footer',
                start: 'top 90%',
                toggleActions: 'play none none none'
            }
        });
    });
    
    gsap.from('.footer-logo', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        scrollTrigger: {
            trigger: '.footer',
            start: 'top 90%',
            toggleActions: 'play none none none'
        }
    });
    
    /* --------------------------------------------------------------------------
       J. BUTTON RIPPLE MICRO-INTERACTION (Mouse position aware)
       -------------------------------------------------------------------------- */
    document.querySelectorAll('.btn-primary, .btn-secondary, .btn-cta').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                width: 0; height: 0;
                left: ${x}px; top: ${y}px;
                border-radius: 50%;
                background: rgba(255,255,255,0.2);
                transform: translate(-50%, -50%);
                pointer-events: none;
            `;
            this.appendChild(ripple);
            
            gsap.to(ripple, {
                width: 300,
                height: 300,
                opacity: 0,
                duration: 0.6,
                ease: 'power2.out',
                onComplete: () => ripple.remove()
            });
        });
    });
    
    /* --------------------------------------------------------------------------
       K. MAGNETIC HOVER ON HERO BUTTONS
       -------------------------------------------------------------------------- */
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(btn, {
                x: x * 0.15,
                y: y * 0.15,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.4)'
            });
        });
    });
    
    // Smooth parallax scrolling animations (Desktop only)
    if (window.matchMedia('(pointer: fine)').matches) {
        // Features section header has subtle parallax
        gsap.to('#features .section-title', {
            y: -20,
            scrollTrigger: {
                trigger: '#features',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 2
            }
        });
        
        // Kernel diagram has depth parallax
        gsap.to('.kernel-diagram', {
            y: -15,
            scrollTrigger: {
                trigger: '#kernel',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 2.5
            }
        });
        
        gsap.to('.kernel-info-panel', {
            y: -30,
            scrollTrigger: {
                trigger: '#kernel',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 3
            }
        });
    }
    

    /* --------------------------------------------------------------------------
       M. SCROLL PROGRESS BAR
       -------------------------------------------------------------------------- */
    const progressFill = document.getElementById('scrollProgressFill');
    if (progressFill) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            progressFill.style.width = `${progress}%`;
        });
    }
    
    /* --------------------------------------------------------------------------
       N. CURSOR PARTICLE TRAIL (Desktop only)
       -------------------------------------------------------------------------- */
    const trailCanvas = document.getElementById('cursorTrailCanvas');
    if (trailCanvas && window.matchMedia('(pointer: fine)').matches) {
        const ctx = trailCanvas.getContext('2d');
        let particles = [];
        let mouseX = 0, mouseY = 0;
        
        function resizeTrailCanvas() {
            trailCanvas.width = window.innerWidth;
            trailCanvas.height = window.innerHeight;
        }
        resizeTrailCanvas();
        window.addEventListener('resize', resizeTrailCanvas);
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Spawn 2 particles per move
            for (let i = 0; i < 2; i++) {
                particles.push({
                    x: mouseX + (Math.random() - 0.5) * 4,
                    y: mouseY + (Math.random() - 0.5) * 4,
                    vx: (Math.random() - 0.5) * 1.2,
                    vy: (Math.random() - 0.5) * 1.2,
                    size: Math.random() * 3 + 1.5,
                    alpha: 0.6,
                    life: 40 + Math.random() * 20
                });
            }
        });
        
        function animateTrail() {
            ctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
            
            // Get accent color for particles
            const style = getComputedStyle(document.body);
            const accentRgb = style.getPropertyValue('--color-accent-rgb').trim() || '108, 92, 150';
            
            particles.forEach((p, i) => {
                p.x += p.vx;
                p.y += p.vy;
                p.alpha -= 0.015;
                p.size *= 0.98;
                p.life--;
                
                if (p.life <= 0 || p.alpha <= 0) {
                    particles.splice(i, 1);
                    return;
                }
                
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${accentRgb}, ${p.alpha})`;
                ctx.fill();
            });
            
            // Cap particle count
            if (particles.length > 100) {
                particles = particles.slice(-100);
            }
            
            requestAnimationFrame(animateTrail);
        }
        animateTrail();
    }
    
    /* --------------------------------------------------------------------------
       O. MOUSE-FOLLOW GLOW ON BENTO CARDS
       -------------------------------------------------------------------------- */
    document.querySelectorAll('.bento-card').forEach(card => {
        // Create glow element
        const glow = document.createElement('div');
        glow.className = 'card-glow-follow';
        card.appendChild(glow);
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            glow.style.left = `${x}px`;
            glow.style.top = `${y}px`;
        });
    });
    
    /* --------------------------------------------------------------------------
       Q. ANIMATED NUMBER COUNTER ON STAT BOXES
       -------------------------------------------------------------------------- */
    const statNums = document.querySelectorAll('.stat-num');
    if (statNums.length > 0 && typeof gsap !== 'undefined') {
        statNums.forEach(num => {
            const finalValue = num.textContent.trim();
            const numericMatch = finalValue.match(/[\d.]+/);
            
            if (numericMatch) {
                const targetNum = parseFloat(numericMatch[0]);
                const suffix = finalValue.replace(numericMatch[0], '');
                const isFloat = finalValue.includes('.');
                
                ScrollTrigger.create({
                    trigger: num,
                    start: 'top 85%',
                    once: true,
                    onEnter: () => {
                        let obj = { val: 0 };
                        gsap.to(obj, {
                            val: targetNum,
                            duration: 1.8,
                            ease: 'power2.out',
                            onUpdate: () => {
                                num.textContent = (isFloat ? obj.val.toFixed(1) : Math.floor(obj.val)) + suffix;
                            }
                        });
                    }
                });
            }
        });
    }
    
    /* --------------------------------------------------------------------------
       R. SECTION TITLE SHIMMER ON SCROLL REVEAL
       -------------------------------------------------------------------------- */
    if (typeof gsap !== 'undefined') {
        document.querySelectorAll('.section-title').forEach(title => {
            ScrollTrigger.create({
                trigger: title,
                start: 'top 80%',
                once: true,
                onEnter: () => {
                    title.classList.add('shimmer-active');
                }
            });
        });
    }
    
    /* --------------------------------------------------------------------------
       S. NAV LINKS STAGGER ENTRANCE
       -------------------------------------------------------------------------- */
    if (typeof gsap !== 'undefined') {
        gsap.from('.nav-link', {
            y: -20,
            opacity: 0,
            stagger: 0.08,
            duration: 0.5,
            delay: 0.3,
            ease: 'power2.out'
        });
        
        gsap.from('.theme-select-trigger', {
            scale: 0,
            rotation: -180,
            opacity: 0,
            duration: 0.6,
            delay: 0.8,
            ease: 'back.out(2)'
        });
        
        gsap.from('.btn-cta', {
            x: 30,
            opacity: 0,
            duration: 0.5,
            delay: 0.9,
            ease: 'power2.out'
        });
    }
    
    /* --------------------------------------------------------------------------
       T. HERO PARALLAX MOUSE MOVEMENT (Depth Layers)
       -------------------------------------------------------------------------- */
    const heroSection = document.querySelector('.hero-section');
    if (heroSection && window.matchMedia('(pointer: fine)').matches) {
        heroSection.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;
            
            // Move orbs at different speeds (orbs use position:absolute, transform is safe)
            const orb1 = document.querySelector('.orb-1');
            const orb2 = document.querySelector('.orb-2');
            if (orb1) orb1.style.transform = `translate(${x * 20}px, ${y * 15}px)`;
            if (orb2) orb2.style.transform = `translate(${x * -15}px, ${y * -10}px)`;
            
            // Background grid subtle shift
            const grid = document.querySelector('.hero-bg-grid');
            if (grid) grid.style.transform = `translate(${x * 5}px, ${y * 5}px)`;
        });
    }
    
    console.log('🎯 Advanced micro-interactions initialized.');
});
