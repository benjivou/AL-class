package com.example.myapplication.ui.viewmodels

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.liveData
import com.example.myapplication.data.models.User

class ProfileViewModel : ViewModel(){
    val user: MutableLiveData<User?> = MutableLiveData(null)
}