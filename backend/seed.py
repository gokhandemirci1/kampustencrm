"""
Veritabanını seed et (ilk kullanıcıları ekle)
"""
from app.database import SessionLocal, engine, Base
from app.models import User
from app.utils import get_password_hash

# Veritabanı tablolarını oluştur
Base.metadata.create_all(bind=engine)

db = SessionLocal()

# Kullanıcıları oluştur
users_data = [
    {
        "email": "gokhan@kampus.com",
        "password": "QWQD$(u~p3",
        "can_manage_customers": True,
        "can_manage_financial": True,
        "can_manage_collaboration_codes": True,
        "can_view_collaboration_stats": True,
        "can_manage_access": True,
        "can_delete_users": True,
    },
    {
        "email": "emre@kampus.com",
        "password": "Fco6hgVch2",
        "can_manage_customers": True,
        "can_manage_financial": True,
        "can_manage_collaboration_codes": True,
        "can_view_collaboration_stats": True,
        "can_manage_access": True,
        "can_delete_users": True,
    },
    {
        "email": "irem-kanbay@kampus.com",
        "password": "E6sD47(X[%",
        "can_manage_customers": True,
        "can_manage_financial": False,
        "can_manage_collaboration_codes": False,
        "can_view_collaboration_stats": False,
        "can_manage_access": False,
        "can_delete_users": False,
    },
    {
        "email": "emre-unal@kampus.com",
        "password": "TGFFqCaY]K",
        "can_manage_customers": False,
        "can_manage_financial": True,
        "can_manage_collaboration_codes": True,
        "can_view_collaboration_stats": False,
        "can_manage_access": False,
        "can_delete_users": False,
    },
    {
        "email": "gokce-demirci@kampus.com",
        "password": "gK5iU|KZBw",
        "can_manage_customers": False,
        "can_manage_financial": False,
        "can_manage_collaboration_codes": False,
        "can_view_collaboration_stats": False,
        "can_manage_access": True,
        "can_delete_users": False,
    },
    {
        "email": "burcu-akbas@kampus.com",
        "password": "2!1q@<y$nf",
        "can_manage_customers": False,
        "can_manage_financial": False,
        "can_manage_collaboration_codes": False,
        "can_view_collaboration_stats": False,
        "can_manage_access": False,
        "can_delete_users": False,
    },
    {
        "email": "bilal-acar@kampus.com",
        "password": "&!wtByzkHG",
        "can_manage_customers": False,
        "can_manage_financial": False,
        "can_manage_collaboration_codes": False,
        "can_view_collaboration_stats": True,
        "can_manage_access": False,
        "can_delete_users": False,
    },
]

try:
    for user_data in users_data:
        # Kullanıcı zaten var mı kontrol et
        existing_user = db.query(User).filter(User.email == user_data["email"]).first()
        
        if not existing_user:
            user = User(
                email=user_data["email"],
                password=get_password_hash(user_data["password"]),
                can_manage_customers=user_data["can_manage_customers"],
                can_manage_financial=user_data["can_manage_financial"],
                can_manage_collaboration_codes=user_data["can_manage_collaboration_codes"],
                can_view_collaboration_stats=user_data["can_view_collaboration_stats"],
                can_manage_access=user_data["can_manage_access"],
                can_delete_users=user_data["can_delete_users"]
            )
            db.add(user)
            print(f"✅ Kullanıcı eklendi: {user_data['email']}")
        else:
            print(f"ℹ️  Kullanıcı zaten mevcut: {user_data['email']}")
    
    db.commit()
    print("\n✅ Seed tamamlandı!")
    
except Exception as e:
    db.rollback()
    print(f"❌ Hata: {e}")
finally:
    db.close()

