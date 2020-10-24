package com.example.myapplication.ui.activity

import android.os.Bundle
import android.renderscript.RenderScript
import android.widget.Button
import android.widget.EditText
import androidx.appcompat.app.AppCompatActivity
import com.androidnetworking.AndroidNetworking
import com.androidnetworking.common.Priority
import com.androidnetworking.error.ANError
import com.androidnetworking.interfaces.JSONArrayRequestListener
import com.example.myapplication.R
import com.example.myapplication.databinding.ActivityMainBinding
import org.json.JSONArray


class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        AndroidNetworking.initialize(this.applicationContext);
    }
}
