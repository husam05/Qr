# 🎨 QR Customization Quick Reference

## Social Media Platforms (12)

| Platform | Color | Icon | URL Pattern |
|----------|-------|------|-------------|
| Instagram | `#E4405F` | 📷 | `instagram.com/` |
| TikTok | `#000000` | 🎵 | `tiktok.com/@` |
| Facebook | `#1877F2` | 👥 | `facebook.com/` |
| X (Twitter) | `#000000` | ✖️ | `x.com/` |
| LinkedIn | `#0A66C2` | 💼 | `linkedin.com/in/` |
| YouTube | `#FF0000` | ▶️ | `youtube.com/` |
| GitHub | `#181717` | 💻 | `github.com/` |
| WhatsApp | `#25D366` | 💬 | `wa.me/` |
| Telegram | `#26A5E4` | ✈️ | `t.me/` |
| Snapchat | `#FFFC00` | 👻 | `snapchat.com/add/` |
| Pinterest | `#E60023` | 📌 | `pinterest.com/` |

## Business Types (6)

| Type | Color | Icon |
|------|-------|------|
| Store/Shop | `#10B981` | 🏪 |
| Restaurant | `#F59E0B` | 🍽️ |
| Website | `#6366F1` | 🌐 |
| Portfolio | `#8B5CF6` | 💼 |
| Contact | `#EC4899` | 📞 |
| Event | `#F43F5E` | 🎉 |

## Quick Commands

### Create Link with Customization
```bash
POST /api/links
{
  "label": "My Link",
  "url": "https://example.com",
  "qrCustomization": {
    "color": "#E4405F",
    "bgColor": "#ffffff",
    "icon": "📷",
    "platform": "instagram"
  }
}
```

### Get Social Template
```bash
POST /api/links/social-template
{
  "platform": "instagram",
  "username": "my_brand"
}
```

### Get AI Suggestions
```bash
POST /api/links/qr-suggestions
{
  "label": "My Page",
  "url": "https://instagram.com/mypage"
}
```

## Error Correction Levels

- **L (7%)** - Digital only
- **M (15%)** - Default ✅
- **Q (25%)** - Print materials
- **H (30%)** - High-risk

## Color Presets (15)

```
#000000  #FF0000  #00FF00  #0000FF  #FFFF00
#FF00FF  #00FFFF  #FFA500  #800080  #008000
#E4405F  #1877F2  #25D366  #FF0000  #0A66C2
```

## Component Props

### QRCustomizer
```jsx
<QRCustomizer 
  onCustomize={(data) => {...}}
  initialLabel="Label"
  initialUrl="URL"
/>
```

### SocialQuickSetup
```jsx
<SocialQuickSetup 
  onComplete={(data) => {...}}
/>
```

## File Structure

```
backend/
  utils/
    qrGenerator.js     # QR generation utilities
  routes/
    links.js           # QR customization endpoints
  models/
    Link.js            # Schema with qrCustomization

frontend/
  components/
    QRCustomizer.jsx   # Full customization modal
    SocialQuickSetup.jsx # Social media wizard
  pages/
    Dashboard.jsx      # Integrated components
```

## Database Schema

```javascript
qrCustomization: {
  color: String,           // #E4405F
  backgroundColor: String, // #ffffff
  logo: String,           // Base64
  style: String,          // square/dots/rounded
  errorCorrection: String,// L/M/Q/H
  icon: String,           // 📷
  platform: String        // instagram
}
```

## Testing URLs

- Instagram: `https://instagram.com/test`
- GitHub: `https://github.com/test`
- Store: `https://mystore.com`
- Restaurant: `https://restaurant.com/menu`
- Portfolio: `https://portfolio.design`

## Common Issues

| Issue | Solution |
|-------|----------|
| Won't scan | Use #000000 on #ffffff |
| No color | Check qrCustomization in payload |
| Template missing | Verify platform name lowercase |
| Slow generation | Reduce QR size or complexity |

## Performance Metrics

- QR Generation: 50-100ms
- AI Suggestions: 200-300ms
- Social Templates: Instant
- DB Query: 20-50ms

## Best Practices

✅ Use brand colors for consistency
✅ Test QR codes before printing
✅ Keep high contrast for scanning
✅ Use Quick Social Setup for speed
✅ Add icons for recognition

❌ Don't use light colors on light background
❌ Don't make QR too small (< 200px)
❌ Don't use low contrast colors
❌ Don't skip testing after customization

---

**Quick Start:**
1. Click "Quick Social Setup" → Select platform → Enter username → Done!
2. Or click "Customize QR" → Pick colors → Apply → Create!

**Support:** Check QR_CUSTOMIZATION_GUIDE.md for detailed docs
