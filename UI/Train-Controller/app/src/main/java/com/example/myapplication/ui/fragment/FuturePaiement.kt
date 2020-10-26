package com.example.myapplication.ui.fragment

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.example.myapplication.R

private const val TAG = "FuturePaiement"

/**
 * A simple [Fragment] subclass.
 * Use the [FuturePaiement.newInstance] factory method to
 * create an instance of this fragment.
 */
class FuturePaiement : Fragment() {
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_future_paiement, container, false)
    }


}