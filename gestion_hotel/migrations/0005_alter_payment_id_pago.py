# Generated by Django 5.1 on 2024-11-22 20:31

import gestion_hotel.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gestion_hotel', '0004_remove_payment_id_alter_payment_id_pago'),
    ]

    operations = [
        migrations.AlterField(
            model_name='payment',
            name='ID_Pago',
            field=models.CharField(default=gestion_hotel.models.generar_id_pago, editable=False, max_length=10, primary_key=True, serialize=False, unique=True),
        ),
    ]
