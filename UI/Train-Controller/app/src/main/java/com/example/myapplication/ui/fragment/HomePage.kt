package com.example.myapplication.ui.fragment

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.navigation.findNavController
import androidx.navigation.fragment.findNavController
import com.example.myapplication.databinding.HomeFragmentBinding
import kotlinx.android.synthetic.main.home_fragment.*


/**
 * A simple [Fragment] subclass.
 * Use the [HomePage.newInstance] factory method to
 * create an instance of this fragment.
 */
class HomePage : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? = HomeFragmentBinding.inflate(inflater,container,false).root

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        goScanQRbtn.setOnClickListener { findNavController().navigate(HomePageDirections.actionHomePageToScanQr()) }
        goToFraudeBtn.setOnClickListener {findNavController().navigate(HomePageDirections.actionHomePageToManuallFraudFormulaire()) }

    }

}
