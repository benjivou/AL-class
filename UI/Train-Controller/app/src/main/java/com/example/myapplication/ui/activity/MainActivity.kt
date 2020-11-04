package com.example.myapplication.ui.activity

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.androidnetworking.AndroidNetworking
import com.example.myapplication.databinding.ActivityMainBinding


class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        AndroidNetworking.initialize(this.applicationContext);
    }
}
